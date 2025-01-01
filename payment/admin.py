from django.contrib import admin
from .models import (
    Customer, 
    Subscription, 
    Invoice, 
    Product, 
    Price,
    PaymentMethod
)

class PriceInline(admin.TabularInline):
    model = Price
    extra = 0
    fields = ('title', 'amount', 'currency', 'billing_period', 'stripe_id')

class InvoiceInline(admin.StackedInline):
    model = Invoice
    extra = 0
    feilds = ('id', 'subscription', 'stripe_id', 'status', 'amount_due', 'amount_paid', 'paid_at', 'next_payment_attempt')
    classes = ['collapse']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    inlines = [PriceInline]

@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'amount', 'currency', 'billing_period')
    list_filter = ('billing_period',)

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'stripe_id')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'stripe_id', 'status', 'current_period_start', 'current_period_end')
    list_filter = ('status',)
    list_filter = ('status',)
    search_fields = ('customer__user__username', 'stripe_id')
    inlines = [InvoiceInline]

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'subscription', 'stripe_id', 'status', 'amount_due', 'amount_paid', 'paid_at')
    list_filter = ('status',)
    search_fields = ('subscription__customer__user__username', 'stripe_id')

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('customer', 'type', 'card_brand', 'last_four_digits', 'created_at')
    search_fields = ('customer__user__email', 'type', 'card_brand', 'last_four_digits')
    list_filter = ('type', 'card_brand', 'created_at')