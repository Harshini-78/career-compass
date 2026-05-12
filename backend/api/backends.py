from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # User might pass email in the username field
            user = UserModel.objects.filter(email=username).first()
            if not user:
                # Fall back to checking actual username
                user = UserModel.objects.filter(username=username).first()
                
            if user and user.check_password(password) and self.user_can_authenticate(user):
                return user
        except Exception:
            return None
        return None
