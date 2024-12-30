from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

class IsTokenValid(BasePermission):
    """
    Custom permission to ensure the token is not blacklisted.
    """

    def has_permission(self, request, view):
        # Extract the token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                # Validate the access token
                access_token = AccessToken(token)
                # Check if the token is blacklisted
                outstanding_token = OutstandingToken.objects.get(token=token)
                if BlacklistedToken.objects.filter(token=outstanding_token).exists():
                    return False  # Token is blacklisted
            except OutstandingToken.DoesNotExist:
                pass
            except Exception:
                return False  # Any invalid token should deny access
        return True
