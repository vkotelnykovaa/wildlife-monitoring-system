from django.urls import path
from .views import EmailLoginView

urlpatterns = [
    path("login/", EmailLoginView.as_view(), name="login"),
]