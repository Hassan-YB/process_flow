from django.db.models import TextChoices

class GenderChoices(TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    OTHER = 'other', 'Other'

class NotificationChoices(TextChoices):
    ACCOUNT = 'account', 'Account'
    PRODUCT = 'product', 'Product'