from django.urls import path
from .views import weather_data_api

urlpatterns = [
    path('api/weather/', weather_data_api, name='weather_data_api'),
]
