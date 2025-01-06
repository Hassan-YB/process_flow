from rest_framework import serializers
from .models import Customer, Product, Price, Subscription, Invoice, PaymentMethod


class CustomerSerializer(serializers.ModelSerializer):
    has_subscription = serializers.BooleanField(read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'user', 'stripe_id', 'has_subscription']
        read_only_fields = ['id', 'stripe_id', 'has_subscription']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'stripe_id', 'name', 'description']


class PriceSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Price
        fields = [
            'id', 'product', 'slug', 'stripe_id', 'amount', 'currency',
            'description', 'title', 'billing_period', 'is_active'
        ]

    def get_is_active(self, obj):
        """Check if the price has an active subscription for the user."""
        user = self.context.get('request').user
        if not user.is_authenticated:
            return False

        # Check if there is an active subscription for this price
        active_subscription = Subscription.objects.filter(
            customer__user=user,
            price=obj,
            status__in=[Subscription.Status.ACTIVE, Subscription.Status.TRIALING]
        ).exists()
        return active_subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='price.title', read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id', 'customer', 'price', 'stripe_id', 'item_id',
            'current_period_start', 'current_period_end', 'status',
            'original_amount', 'discounted_amount', 'title'
        ]
        read_only_fields = ['id', 'stripe_id', 'item_id', 'title']


class InvoiceSerializer(serializers.ModelSerializer):
    amount_due_usd = serializers.FloatField(read_only=True)
    amount_paid_usd = serializers.FloatField(read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'subscription', 'stripe_id', 'currency', 'amount_due',
            'amount_paid', 'period_start', 'period_end', 'is_paid',
            'paid_at', 'next_payment_attempt', 'status',
            'hosted_invoice_url', 'amount_due_usd', 'amount_paid_usd'
        ]
        read_only_fields = [
            'id', 'stripe_id', 'amount_due_usd', 'amount_paid_usd'
        ]


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'customer', 'type', 'card_brand',
            'last_four_digits', 'is_active'
        ]
        read_only_fields = ['id']