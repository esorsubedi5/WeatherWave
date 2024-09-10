from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = (
        'username', 'email', 'mobile', 'first_name', 'last_name', 
        'is_staff', 'is_active', 'date_joined'
    )
    search_fields = ('username', 'email', 'mobile', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_active', 'date_joined')

admin.site.register(CustomUser, CustomUserAdmin)