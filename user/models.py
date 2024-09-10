from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.core import validators
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, mobile=None, password=None, **extra_fileds): 
        """
        Create and return a regular user with an email, username, and password.
        """
        if not username:
            raise ValueError('Username field must be provided')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        
        user = self.model(username=username, email=email, mobile=mobile, **extra_fileds)
        user.set_password(password)
        user.save()
        
        return user
    
    def create_superuser(self, username, email, mobile=None, password=None, **extra_fields):
        """
        Create and return a superuser with an email, username, password, and staff and superuser status.
        """
        user = self.create_user(username, email, mobile, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        
class CustomUser(AbstractUser, PermissionsMixin):
    """
    Custom user model with additional fields such as mobile number.
    """
    username = models.CharField(
        _("username"),
        max_length = 150,
        unique = True,
        help_text = _("Username is required. Letters, digits and @/./+/-/_ only."
                      ),
        error_messages = {
            "unique": _("A user with that username already exists."),
        },
        )
    # Email Validated using Build-in Email Field
    email = models.EmailField(unique=True)
    
    #moile number validation
    mobile = models.CharField(
        _("mobile"),
        max_length = 20,
        unique = True,
        validators = [
            RegexValidator(regex=r'^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$', message=_("Phone number must contain exactly 10 digits.")),
            ],
        help_text = _("Enter a valid phone number. Only digits are allowed."),
        error_messages = {
            "unique": _("A user with this phone number already exists."),
            },
        )
    
    first_name = models.CharField(_("first name"), max_length = 150, blank = True)
    last_name = models.CharField(_("last name"), max_length = 150, blank = True)
    
    is_staff = models.BooleanField(
        _("active"),
        default = True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
            ),    
        )
    date_joined = models.DateTimeField(_("date joined"), default = timezone.now)
    
    objects = CustomUserManager()
    
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "mobile", "first_name", "last_name"]
    

    def __str__(self):
        return self.username
    
    
# Set related names for groups and user permissions
CustomUser._meta.get_field('groups').remote_field.related_name = 'customuser_groups'
CustomUser._meta.get_field('user_permissions').remote_field.related_name = 'customuser_user_permissions'