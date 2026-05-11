from django.contrib import admin
from .models import Product
from .models import Order

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "created_at")
    search_fields = ("name",)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "customer_email", "total", "created_at")