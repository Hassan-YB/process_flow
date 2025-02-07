import stripe
from .models import Product, Price
from django.conf import settings

def import_product_and_prices(product_id):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    try:
        # Retrieve product from Stripe
        stripe_product = stripe.Product.retrieve(product_id)
        product, created_product = Product.objects.get_or_create(
            stripe_id=stripe_product.id,
            defaults={
                "name": stripe_product.name,
                "description": stripe_product.description
            }
        )
        if created_product:
            print(f"Created Product: {product}")
        else:
            print(f"Product already exists: {product}")

        try:
            type = stripe_product['metadata']['type']
        except:
            type = None

        # Retrieve prices for the product
        prices = stripe.Price.list(product=product_id)
        for stripe_price in prices.auto_paging_iter():
            price_id = stripe_price['id']
            title = stripe_price['nickname']
            unit_amount = stripe_price['unit_amount_decimal']
            currency = stripe_price['currency']
            interval = stripe_price['recurring']['interval']
            
            # Map 'interval' value to appropriate BillingPeriodType
            if 'month' in interval:
                billing_period = Price.BillingPeriodType.MONTHLY
            elif 'year' in interval:
                billing_period = Price.BillingPeriodType.YEARLY
            else:
                billing_period = Price.BillingPeriodType.MONTHLY  # Default to monthly if unknown
            
            price, created_price = Price.objects.get_or_create(
                stripe_id=price_id,
                defaults={
                    "product": product,
                    "amount": float(unit_amount) / 100,  # Convert amount from cents to dollars
                    "currency": currency,
                    "title": Price.Title(title),
                    "billing_period": billing_period
                }
            )
            if created_price:
                print(f"Created Price: {price}")
            else:
                print(f"Price already exists: {price}")
            if created_price:
                print(f"Created Price: {price}")
            else:
                print(f"Price already exists: {price}")

    except stripe.error.InvalidRequestError as e:
        print(f"Error: {e}")
