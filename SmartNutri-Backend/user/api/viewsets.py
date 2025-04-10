from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from user.models import CustomUser
from django.urls import reverse
from rest_framework.permissions import IsAuthenticated 
from .serializers import UserSerializer, LoginSerializer, HomepageSerializer

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'refresh': str(refresh),
            'access': str(access_token),
            'user_id': user.id,
        }, status=status.HTTP_201_CREATED)



class UserViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Autentica o usuário
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Gera os tokens JWT
            refresh = RefreshToken.for_user(user)
            # Retorna os tokens ou redireciona para a homepage
            return redirect("/home/")  # Substitua "/" pela URL da sua homepage
        else:
            return Response(
                {"detail": "Credenciais inválidas."},
                status=status.HTTP_401_UNAUTHORIZED
            )
      

class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        # Valida os dados usando o LoginSerializer
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Gera os tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        # Retorna os tokens e informações do usuário
        return Response({
            'refresh': str(refresh),
            'access': str(access_token),
            'user_id': user.id,
        }, status=status.HTTP_200_OK)
        
    
class HomepageViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]  

    def list(self, request):
        data = {
            "message": "Bem-vindo à sua homepage!",
            "status": "sucesso",
            "items": ["Item 1", "Item 2", "Item 3"], 
        }

        return Response(data)