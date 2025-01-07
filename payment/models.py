from django.db import models
from core.models import BaseDateTimeModel
from django.utils.text import slugify
from django.conf import settings
from datetime import datetime
from django.utils.timezone import make_aware
from users.models import User
import stripe

class Customer(BaseDateTimeModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="billing_customer")
    stripe_id = models.CharField(max_length=1000, unique=True)

    def __str__(self):
        return self.user.email
    
    @property
    def has_subscription(self):
        return self.subscriptions.exists()
        
class Product(BaseDateTimeModel):
    stripe_id = models.CharField(max_length=1000, unique=True, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Price(BaseDateTimeModel):

    class BillingPeriodType(models.TextChoices):
        MONTHLY = 'monthly', 'Monthly'
        YEARLY = 'yearly', 'Yearly'

    class Title(models.TextChoices):
        FREE = 'free', 'Free'
        BASIC = 'Basic', 'Basic'
        PRO = 'Pro', 'Pro'

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="pricings")
    slug = models.SlugField(max_length=255, unique=True)
    stripe_id = models.CharField(max_length=1000, unique=True, null=True, blank=True)
    amount = models.FloatField(default=0.0)
    currency = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    title = models.CharField(max_length=255, choices=Title.choices, default=Title.FREE)
    billing_period = models.CharField(max_length=50, choices=BillingPeriodType.choices, default=BillingPeriodType.MONTHLY)

    def save(self, *args, **kwargs):
        if not self.slug:
            title_slug = slugify(self.title)
            billing_period_slug = slugify(self.billing_period)
            self.slug = f"{title_slug}-{billing_period_slug}"
            slug = self.slug
            unique_slug = slug
            num = 1
            while Price.objects.filter(slug=unique_slug).exists():
                unique_slug = '{}-{}'.format(slug, num)
                num += 1
            self.slug = unique_slug

        super(Price, self).save(*args, **kwargs)

class Subscription(BaseDateTimeModel):

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        CANCELED = 'canceled', 'Canceled'
        INCOMPLETE = 'incomplete', 'Incomplete'
        INCOMPLETE_EXPIRED = 'incomplete_expired', 'Incomplete Expired'
        TRIALING = 'trialing', 'Trialing'
        PAST_DUE = 'past_due', 'Past Due'
        UNPAID = 'unpaid', 'Unpaid'
        PAUSED = 'paused', 'Paused'

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="subscriptions")
    price = models.ForeignKey(Price, on_delete=models.CASCADE, related_name="subscriptions")
    payment_method = models.ForeignKey('payment.PaymentMethod', on_delete=models.SET_NULL, null=True, blank=True)
    stripe_id = models.CharField(max_length=1000, unique=True, null=True, blank=True)
    item_id = models.CharField(max_length=1000, null=True, blank=True)
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.TRIALING)
    original_amount = models.FloatField(default=0.0, null=True, blank=True)
    discounted_amount = models.FloatField(default=0.0, null=True, blank=True)
        
    @property
    def title(self):
        status = self.status
        if self.status:
            return status
        
    def __str__(self):
        return f"{self.customer.user.email}: {self.status}"
    
class Invoice(BaseDateTimeModel):

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        DRAFT = 'draft', 'Draft'
        OPEN = 'open', 'Open'

    subscription = models.ForeignKey(Subscription, on_delete = models.CASCADE, related_name = "invoices")
    stripe_id = models.CharField(max_length=1000, unique=True, null=True, blank=True)
    currency = models.CharField(max_length=100)
    amount_due = models.FloatField()
    amount_paid = models.FloatField()
    period_start = models.DateTimeField(null=True, blank=True)
    period_end = models.DateTimeField(null=True, blank=True)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    next_payment_attempt = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    hosted_invoice_url = models.URLField(null=True, blank=True)

    @property
    def amount_due_usd(self):
        if int(self.amount_due) == 0:
            return 0.0
        if self.amount_due:
            return self.amount_due / 100
        
    @property
    def amount_paid_usd(self):
        if self.amount_paid:
            return self.amount_paid / 100

    def __str__(self):
        return self.status
    
    @staticmethod
    def create_upcoming_invoice(subscription_id):
        try:

            stripe.api_key = settings.STRIPE_SECRET_KEY
            data = stripe.Invoice.upcoming(subscription = subscription_id)
            subscription_id = data.get("subscription")
            amount_due = data.get("amount_due")
            amount_paid = data.get("amount_paid")
            status = data.get("status")
            currency = data.get("currency")
            next_payment_attempt = data.get("next_payment_attempt")
            period_end = data.get("period_end")
            period_start = data.get("period_start")
            
            invoice, is_created = Invoice.objects.get_or_create(
                subscription = Subscription.objects.get(stripe_id=subscription_id),
                amount_due = amount_due,
                amount_paid = amount_paid,
                currency = currency
            )
            
            invoice.status = status
            if next_payment_attempt:
                invoice.next_payment_attempt = make_aware(datetime.fromtimestamp(next_payment_attempt))
            if period_start:
                invoice.period_start = make_aware(datetime.fromtimestamp(period_start))
            if period_end:
                invoice.period_end =  make_aware(datetime.fromtimestamp(period_end))
            invoice.save()
        except:
            pass
    
class PaymentMethod(BaseDateTimeModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="payment_methods")
    type = models.CharField(max_length=255)
    card_brand = models.CharField(max_length=50)
    last_four_digits = models.CharField(max_length=4)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.customer}: {self.type}"