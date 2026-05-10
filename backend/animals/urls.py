from django.urls import path
from .views import AnimalListView, AnimalDetailView, AdoptionCreateView
from .views import GPSDataCreateView, AnimalGPSView, OrderCreateView, UserOrdersView, AnimalActivityView

urlpatterns = [
    path('animals/', AnimalListView.as_view(), name="animal-list"),
    path('animals/<int:id>/', AnimalDetailView.as_view()),
    path('gps/', GPSDataCreateView.as_view()), 
    path('animals/<int:animal_id>/gps/', AnimalGPSView.as_view()),
    path("adoptions/create/", AdoptionCreateView.as_view()),
    path("orders/create/", OrderCreateView.as_view()),
    path("orders/my/", UserOrdersView.as_view()),
    path("animals/<int:animal_id>/activity/", AnimalActivityView.as_view()),
]