from django.db import models
from django.conf import settings

class Animal(models.Model):
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    collar_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GPSData(models.Model):
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='gps_data')
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.animal.name} - {self.timestamp}"

class Adoption(models.Model):
    animal = models.ForeignKey(
        Animal,
        on_delete=models.CASCADE,
        related_name="adoptions"
    )

    name = models.CharField(max_length=100)

    email = models.EmailField()

    donation_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} -> {self.animal.name}"

