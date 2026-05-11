from rest_framework import serializers
from .models import Animal, GPSData
from .models import Adoption


class GPSDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPSData
        fields = '__all__'


class AnimalSerializer(serializers.ModelSerializer):
    gps_data = GPSDataSerializer(many=True, read_only=True)

    class Meta:
        model = Animal
        fields = '__all__'

class AdoptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adoption
        fields = "__all__"

