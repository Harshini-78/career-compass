import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User
from django.contrib.auth.hashers import check_password

try:
    admin = User.objects.get(username='admin')
    passwords = ['admin', 'admin123', 'password', 'password123', '12345', 'careercompass', 'Harshu@2006']

    for p in passwords:
        if check_password(p, admin.password):
            print(f"Password is: {p}")
            break
    else:
        print("Password not found in common list. Resetting password to 'admin123'...")
        admin.set_password('admin123')
        admin.save()
        print("Password has been reset to 'admin123'.")
except User.DoesNotExist:
    print("Admin user not found. Creating admin user...")
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='admin')
    print("Admin user created with username 'admin' and password 'admin123'.")
