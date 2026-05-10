from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import EmailLoginView, RegisterView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", EmailLoginView.as_view()),
    path("api/", include("animals.urls")),
    path("api/auth/register/", RegisterView.as_view()),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
]