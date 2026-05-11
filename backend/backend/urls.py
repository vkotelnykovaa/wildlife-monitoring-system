from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import EmailLoginView, RegisterView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", EmailLoginView.as_view()),
    path("api/", include("animals.urls")),
    path("api/auth/register/", RegisterView.as_view()),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
    path("api/shop/", include("shop.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)