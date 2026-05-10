from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Адміністратор"),
        ("researcher", "Науковець"),
        ("client", "Клієнт"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="client"
    )