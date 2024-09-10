from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserDetailView,
    UserDeleteView,
    UserLogoutView,
    FieldValidationView)

router = DefaultRouter()

urlpatterns = [
    path('', UserLoginView.as_view(), name='user-login'),
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('me/', UserDetailView.as_view(), name='user-details'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('delete/', UserDeleteView.as_view(), name='user-delete'),
    path('validate/', FieldValidationView.as_view(), name='field-validate'),

    ] + router.urls