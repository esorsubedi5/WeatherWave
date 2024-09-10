"""
Django settings for WeatherWave project.

Based on by 'django-admin startproject' using Django 2.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os
import posixpath
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = '7414b5b8-95d4-4ee2-a83c-9384e8910ee4'
# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = os.getenv('DEBUG')

# ALLOWED_HOSTS
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')
# Remove any leading or trailing whitespaces from the items in the list
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS]

# Application references
# https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-INSTALLED_APPS
INSTALLED_APPS = [
    # Add your apps here to enable them
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # added new for project
    # app
    'user.apps.userConfig',
    'Weather.apps.WeatherConfig',
    

    # other necessary inclusion
    'rest_framework',
    'rest_framework.authtoken',
    'easyaudit',
    'schema_graph',
    'corsheaders',
]

# Middleware framework
# https://docs.djangoproject.com/en/2.1/topics/http/middleware/
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Added for this project
    'easyaudit.middleware.easyaudit.EasyAuditMiddleware',
    # for APIs Communication
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'WeatherWave.urls'

# Template configuration
# https://docs.djangoproject.com/en/2.1/topics/templates/
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'WeatherWave.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
#Database Settings for PostgreSQL
DATABASES = {
        'default' : {
         'ENGINE' : os.getenv('DB_ENGINE'),
         'NAME' : os.getenv('DB_NAME'),
         'USER' : os.getenv('DB_USER'),
         'PASSWORD' : os.getenv('DB_PASSWORD'),
         'HOST' : os.getenv('DB_HOST'),
         'PORT' : os.getenv('DB_PORT'),
         }
     }


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Australia/Sydney'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = posixpath.join(*(BASE_DIR.split(os.path.sep) + ['static']))

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CSRF Settings
CSRF_COOKIE_SECURE = True
CSRF_USE_SESSIONS = True

# Authenticated User Model
AUTH_USER_MODEL = 'user.CustomUser'

# REST FRAMEWORK
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Adjust this to match your frontend URL
]

CORS_ALLOW_CREDENTIALS = True

OPENWEATHERMAP_API_KEY = os.getenv('API_KEY')