from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    View personalizada que utiliza nosso serializador customizado para os tokens JWT.
    Este serializador adiciona o tipo de usuário (cliente ou nutricionista) à resposta do token.
    """
    serializer_class = CustomTokenObtainPairSerializer