import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User

admins = User.objects.filter(role='admin') | User.objects.filter(is_superuser=True)
for admin in admins.distinct():
    print(f"Admin Username: {admin.username}, Email: {admin.email}")
