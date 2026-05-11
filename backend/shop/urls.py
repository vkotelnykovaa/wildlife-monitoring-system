from django.urls import path
from .views import ProductListView, OrderCreateView, UserOrdersView

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("orders/create/", OrderCreateView.as_view()),
    path("orders/my/", UserOrdersView.as_view()),
]