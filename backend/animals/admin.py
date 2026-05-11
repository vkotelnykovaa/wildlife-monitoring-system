from django.contrib import admin
from .models import Animal, GPSData
from .models import Adoption


admin.site.register(Animal)
admin.site.register(GPSData)
admin.site.register(Adoption)
