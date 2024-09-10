from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model, login, logout
from django.utils.translation import gettext_lazy as _
from .serializers import (
    CustomUserCreateSerializer,
    CustomUserSerializer,
    CustomUserUpdateSerializer,
    UserViewSerializer,
)

UserModel = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = CustomUserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            response_data = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'mobile': user.mobile,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            print("Invalid data:", serializer.errors)  # Debugging line
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    API endpoint to handle user login.
    """
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for user login.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        login(request, user)
        
        token, created = Token.objects.get_or_create(user=user)
        response_data = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'token': token.key,
        }
        return Response(response_data, status=status.HTTP_200_OK)

class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    API Endpoint to handle retrieving and updating user details.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserViewSerializer
        return CustomUserUpdateSerializer

class UserDeleteView(APIView):
    """
    API endpoint for user deletion.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Handle DELETE request for user deletion.
        """
        user = request.user
        
        if user.is_superuser:
            return Response({'detail': 'You are not permitted to delete the account.'}, status=status.HTTP_403_FORBIDDEN)
        
        elif user:
            user.delete()
            return Response({'detail': 'User successfully deleted.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {'detail': 'You do not have permission to delete this user.'},
                status=status.HTTP_403_FORBIDDEN
            )


class UserLogoutView(APIView):
    """
    API endpoint for user logout.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for user logout.
        """
        Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response({'detail': 'User successfully logged out.'}, status=status.HTTP_200_OK)
    
class FieldValidationView(APIView):
    def post(self, request, *args, **kwargs):
        field_name = list(request.data.keys())[0]
        value = request.data[field_name]

        # Create a serializer instance with only the field that needs validation
        data = {field_name: value}
        serializer = CustomUserCreateSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
            return Response({}, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)