from pyexpat import model
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _

UserModel = get_user_model()

class CustomUserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with additional confirmation fields.
    """
    confirm_email = serializers.EmailField(write_only=True)
    confirm_password = serializers.CharField(write_only=True,
                                             label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        required=True)
    
    class Meta:
        model = UserModel
        fields = ['username', 'email', 'confirm_email', 'mobile', 'first_name', 'last_name', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data):
        """
        Validate that email and password confirmation fields match.
        """
        # Check if email and confirm_email match
        if data['email'] != data['confirm_email']:
            raise serializers.ValidationError("Emails do not match.")
        
        # Check if password and confirm_password match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        

        return data
    
    def create(self, validated_data):
        """
        Create a new user after validating confirmation fields.
        """
        validated_data.pop('confirm_email', None)
        validated_data.pop('confirm_password', None)

        password = validated_data.pop('password')
        return UserModel.objects.create_user(password=password, **validated_data)
    

class CustomUserSerializer(serializers.ModelSerializer):
    """
        Serializer for user login with username or email.
        Serializer for Updating user credentials.
    """
    username = serializers.CharField(max_length=150, required=True)
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        required=True
    )
    class Meta:
         model = UserModel
         fields = ['username', 'password']
        
    def validate(self, attrs):
        """
        Validate user credentials during login.
        """
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            if '@' in username:
                email = username
                try:
                    user = UserModel.objects.get(email=email)
                except UserModel.DoesNotExist:
                    user = None
            else:
                user = authenticate(request=self.context.get('request'), username=username, password=password)

            if user:
                attrs['user'] = user
            else:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        return attrs
        

class CustomUserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user credentials.
    """
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = UserModel
        fields = ['username', 'email', 'mobile', 'first_name', 'last_name', 'current_password', 'new_password']
        
    def validate(self, data):
        user = self.instance
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({"current_password": "Current password is not correct."})
        
        if 'new_password' in data and data['new_password']:
            if data['current_password'] == data['new_password']:
                raise serializers.ValidationError({"new_password": "New password cannot be the same as the current password."})

        return data
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.mobile = validated_data.get('mobile', instance.mobile)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
        
class UserViewSerializer(serializers.ModelSerializer):
    """
    Serializer for user details view.
    """

    class Meta:
        model = UserModel
        fields = ['id', 'username', 'email', 'mobile', 'first_name', 'last_name','password']

    
