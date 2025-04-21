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
from django.http import HttpResponseRedirect

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
            # Verifica o tipo de usuário para redirecionamento
            if user.tipo == 'nutricionista':
                return redirect("/home/nutricionista/")
            elif user.tipo == 'cliente':
                return redirect("/home/cliente/")
            else:
                return Response(
                    {"detail": "Tipo de usuário inválido."},
                    status=status.HTTP_400_BAD_REQUEST
                )
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

        # Autentica o usuário
        login(request, user)

        # Verifica o tipo de usuário para redirecionamento
        if user.tipo == 'nutricionista':
            return redirect('/api/home/nutricionista/')
        elif user.tipo == 'cliente':
            return redirect('/api/home/cliente/')
        else:
            return Response(
                {"detail": "Tipo de usuário inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    
class HomepageViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='redirect-home')
    def redirect_home(self, request):
        user = request.user
        
        if user.tipo == 'nutricionista':
            return Response(
                {"redirect_url": "/home/nutricionista/"},
                status=status.HTTP_200_OK
            )
        elif user.tipo == 'cliente':
            return Response(
                {"redirect_url": "/home/cliente/"},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": "Tipo de usuário inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path='nutricionista')
    def home_nutricionista(self, request):
        # Retorna uma resposta para a página inicial do nutricionista
        return Response({"message": "Bem-vindo à página inicial do nutricionista!"})

    @action(detail=False, methods=['get'], url_path='cliente')
    def home_cliente(self, request):
        # Retorna uma resposta para a página inicial do cliente
        return Response({"message": "Bem-vindo à página inicial do cliente!"})
