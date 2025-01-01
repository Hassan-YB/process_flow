from django.shortcuts import redirect
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _
from .models import Customer

class SubscriptionRequiredMixin:
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        customer = Customer.objects.filter(user=request.user).first()
        if customer and customer.has_subscription:
            return super().dispatch(request, *args, **kwargs)
        messages.error(request, _("You need an active subscription to access this page."))
        return redirect('subscription_required_page')  # Change to your desired redirect URL
