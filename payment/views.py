from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import make_aware
from django.conf import settings
from rest_framework.viewsets import ViewSet
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse, HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from .models import Customer, Price, Subscription, Invoice, PaymentMethod
from .serializers import PriceSerializer
import stripe
import json
from datetime import datetime


@method_decorator(csrf_exempt, name='dispatch')
class WebhookView(View):
    def post(self, request, *args, **kwargs):
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            webhook_secret = settings.STRIPE_WEBHOOK_SECRET

            request_data = json.loads(request.body)
            if webhook_secret:
                signature = request.META.get('HTTP_STRIPE_SIGNATURE', '')
                try:
                    event = stripe.Webhook.construct_event(
                        payload=request.body,
                        sig_header=signature,
                        secret=webhook_secret,
                    )
                    data = event['data']
                except (ValueError, stripe.error.SignatureVerificationError) as e:
                    print(f"Webhook Error: {e}")
                    return HttpResponse(status=400)
                event_type = event['type']
            else:
                data = request_data['data']
                event_type = request_data['type']

            data_object = data['object']

            # Handle subscription deletion
            if event_type == 'customer.subscription.deleted':
                subscription_id = data_object.get("id")
                subscription = Subscription.objects.filter(stripe_id=subscription_id).first()
                if subscription:
                    subscription.status = data_object.get("status")
                    subscription.save()

            # Handle subscription updates
            if event_type == 'customer.subscription.updated':
                subscription_id = data_object.get("id")
                subscription = Subscription.objects.filter(stripe_id=subscription_id).first()
                if subscription:
                    subscription.status = data_object.get("status")
                    subscription.current_period_start = make_aware(datetime.fromtimestamp(data_object["current_period_start"]))
                    subscription.current_period_end = make_aware(datetime.fromtimestamp(data_object["current_period_end"]))
                    subscription.save()

            # Handle invoice creation
            if event_type == 'invoice.created':
                subscription_id = data_object.get("subscription")
                stripe_id = data_object.get("id")
                invoice, _ = Invoice.objects.get_or_create(
                    subscription=Subscription.objects.filter(stripe_id=subscription_id).first(),
                    stripe_id=stripe_id,
                )
                invoice.amount_due = data_object.get("amount_due", 0)
                invoice.amount_paid = data_object.get("amount_paid", 0)
                invoice.currency = data_object.get("currency")
                invoice.status = data_object.get("status")
                invoice.is_paid = data_object.get("paid", False)
                invoice.period_start = make_aware(datetime.fromtimestamp(data_object["period_start"]))
                invoice.period_end = make_aware(datetime.fromtimestamp(data_object["period_end"]))
                invoice.hosted_invoice_url = data_object.get("hosted_invoice_url")
                invoice.save()

        except Exception as e:
            print(f"Webhook Error: {e}")
            return HttpResponse(status=400)

        return JsonResponse({'status': 'success'}, status=200)


class SubscriptionView(ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        """Create a subscription."""
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            user = request.user
            customer, created = Customer.objects.get_or_create(user=user)

            if created or not customer.stripe_id:
                stripe_customer = stripe.Customer.create(email=user.email)
                customer.stripe_id = stripe_customer.id
                customer.save()

            price_slug = request.data.get('price_slug')
            if not price_slug:
                return Response({"error": "Price slug is required"}, status=status.HTTP_400_BAD_REQUEST)

            price = Price.objects.filter(slug=price_slug).first()
            if not price:
                return Response({"error": "Invalid price slug"}, status=status.HTTP_400_BAD_REQUEST)

            subscription_data = {
                'customer': customer.stripe_id,
                'items': [{'price': price.stripe_id}],
                'collection_method': 'charge_automatically',
                'trial_period_days': 0,
                'payment_behavior': 'default_incomplete',
                'payment_settings': {'save_default_payment_method': 'on_subscription'},
                'expand': ['latest_invoice.payment_intent', 'pending_setup_intent'],
            }

            stripe_subscription = stripe.Subscription.create(**subscription_data)

            subscription = Subscription.objects.create(
                customer=customer,
                price=price,
                stripe_id=stripe_subscription.id,
                current_period_start=make_aware(datetime.fromtimestamp(stripe_subscription.current_period_start)),
                current_period_end=make_aware(datetime.fromtimestamp(stripe_subscription.current_period_end)),
                status=stripe_subscription.status,
                item_id=stripe_subscription['items']['data'][0]['id'],
            )

            client_secret = stripe_subscription['latest_invoice']['payment_intent']['client_secret']
            return Response({"client_secret": client_secret, "subscription_id": subscription.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request):
        """Upgrade an existing subscription."""
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY

            # Get the customer's billing information
            customer = Customer.objects.filter(user=request.user).first()
            if not customer:
                return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

            # Get the customer's active subscription
            subscription = Subscription.objects.filter(customer=customer).order_by('-created_at').first()
            if not subscription:
                return Response({"error": "Subscription not found"}, status=status.HTTP_404_NOT_FOUND)

            # Validate the new price slug
            new_price_slug = request.data.get('price_slug')
            if not new_price_slug:
                return Response({"error": "New price slug is required"}, status=status.HTTP_400_BAD_REQUEST)

            new_price = Price.objects.filter(slug=new_price_slug).first()
            if not new_price:
                return Response({"error": "Invalid new price slug"}, status=status.HTTP_400_BAD_REQUEST)

            # Upgrade the subscription in Stripe
            stripe.Subscription.modify(
                subscription.stripe_id,
                items=[{
                    "id": subscription.item_id,
                    "price": new_price.stripe_id,
                }]
            )

            # Update the subscription in the database
            subscription.price = new_price
            subscription.save()

            return Response({"message": "Subscription upgraded successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def cancel(self, request, subscription_id):
        """Cancel a subscription."""
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY

            subscription = Subscription.objects.get(id=subscription_id)
            if not subscription:
                return Response({"error": "Subscription not found"}, status=status.HTTP_404_NOT_FOUND)

            stripe.Subscription.delete(subscription.stripe_id)

            subscription.status = Subscription.Status.CANCELED
            subscription.save()

            return Response({"message": "Subscription canceled successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def success(self, request, subscription_id):
        """Finalize subscription: store payment method and fetch upcoming invoice."""
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY

            # Fetch subscription from the database
            subscription = Subscription.objects.filter(id=subscription_id, customer__user=request.user).first()
            if not subscription:
                return Response({"error": "Subscription not found"}, status=status.HTTP_404_NOT_FOUND)

            # Retrieve the subscription details from Stripe
            stripe_subscription = stripe.Subscription.retrieve(subscription.stripe_id)
            latest_invoice = stripe_subscription.latest_invoice
            payment_intent = stripe_subscription['latest_invoice']['payment_intent']

            # Save payment method details
            payment_method_id = payment_intent.get('payment_method')
            if payment_method_id:
                payment_method_data = stripe.PaymentMethod.retrieve(payment_method_id)
                PaymentMethod.objects.get_or_create(
                    customer=subscription.customer,
                    type=payment_method_data.type,
                    card_brand=payment_method_data.card.brand,
                    last_four_digits=payment_method_data.card.last4,
                    defaults={'is_active': True},
                )

            # Fetch and store upcoming invoice
            upcoming_invoice = stripe.Invoice.upcoming(subscription=subscription.stripe_id)
            Invoice.objects.create(
                subscription=subscription,
                stripe_id=upcoming_invoice.id,
                amount_due=upcoming_invoice.amount_due,
                currency=upcoming_invoice.currency,
                period_start=make_aware(datetime.fromtimestamp(upcoming_invoice.period_start)),
                period_end=make_aware(datetime.fromtimestamp(upcoming_invoice.period_end)),
                status=upcoming_invoice.status,
                hosted_invoice_url=upcoming_invoice.hosted_invoice_url,
                is_paid=upcoming_invoice.paid,
            )

            return Response({"message": "Subscription finalized successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PriceListView(APIView):
    def get(self, request):
        prices = Price.objects.all()
        serializer = PriceSerializer(prices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
