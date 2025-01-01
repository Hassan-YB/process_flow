from collections import defaultdict
from django.db.models import Exists, OuterRef
from .models import (
    Customer,
    Subscription,
    Price
)
import json

def group_by_pricing(prices):
    # Create a defaultdict to store prices grouped by title
    grouped_prices = defaultdict(list)

    # Group prices by title
    for price in prices:
        # Initialize the dictionary with common attributes
        price_dict = {
            'description': price.description,
            'currency': price.currency.upper(),
            'amount': price.amount,
            'billing_period': price.get_billing_period_display(),
            'slug': price.slug,
            'postings': price.max_number_of_posts
        }
        
        # Check if price object has 'active_subscription' attribute
        if hasattr(price, 'active_subscription'):
            price_dict['active_subscription'] = price.active_subscription
        
        # Append the dictionary to the grouped_prices under the appropriate key
        grouped_prices[price.get_title_display()].append(price_dict)
        
    # Convert defaultdict to a list of dictionaries
    result = [{f'{key}': value} for key, value in grouped_prices.items()]

    # free_plan = {
    #     'description': 'Experience the magic of drag shelter',
    #     'currency': 'USD',
    #     'amount': 0,
    #     'billing_period': None,
    #     'slug': None,
    #     'postings': 5
    # }
    # result.append({
    #     'free': [free_plan]
    # })
    return result

def get_prices(user=None, account_type="business"):
    if account_type == "private":
        account_type = "personal"
    prices_queryset = Price.objects.filter(account_type=account_type).order_by('amount')
    
    if user:
        customer = Customer.objects.filter(user=user)

        # Check if the user is authenticated and has a customer profile
        if user.is_authenticated and customer.exists():
            active_subscriptions = Subscription.objects.filter(
                customer=user.billing_customer,
                price=OuterRef('pk'),
                status__in=[Subscription.Status.ACTIVE, Subscription.Status.TRIALING]
            )
            prices_queryset = prices_queryset.annotate(
                active_subscription=Exists(active_subscriptions)
            )

    if prices_queryset.exists():
        _prices = group_by_pricing(prices_queryset)
        return json.dumps(_prices)

    return None
