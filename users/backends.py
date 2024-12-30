from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        Authenticate a user by email or username.
        """
        UserModel = get_user_model()

        # Check if username is provided
        if username:
            # Determine if username is an email or username
            if "@" in username:
                filter_kwargs = {"email": username}
            else:
                filter_kwargs = {"username": username}
        else:
            return None

        try:
            user = UserModel.objects.get(**filter_kwargs)
        except UserModel.DoesNotExist:
            return None

        # Verify the password and return the user if valid
        if user.check_password(password):
            return user

        return None
