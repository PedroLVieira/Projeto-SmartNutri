from rest_framework import serializers
from django.contrib.auth import authenticate
from user.models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# user/api/serializers.py - Classe UserSerializer atualizada
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'cpf', 'password', 'tipo', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'tipo': {'required': True},
            'username': {'required': False},
        }

    def create(self, validated_data):
        # Se username não for fornecido, usa a parte do email antes do @
        if 'username' not in validated_data or not validated_data['username']:
            email = validated_data['email']
            validated_data['username'] = email.split('@')[0]
            
        user = CustomUser.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data['email']
        password = data['password']

        # Autentica o usuário com base no e-mail
        user = CustomUser.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            raise serializers.ValidationError("Credenciais inválidas.")
        if not user.is_active:
            raise serializers.ValidationError("Usuário inativo.")
        return {'user': user}  # Retorna o usuário validado
    
class HomepageSerializer(serializers.Serializer):
    message = serializers.CharField()
    status = serializers.CharField()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado para token JWT que inclui o tipo de usuário
    e outras informações úteis na resposta.
    """
    user_type = serializers.CharField(required=False, write_only=True)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Adicionar informações personalizadas ao token
        token['tipo'] = user.tipo
        token['email'] = user.email
        
        return token

    def validate(self, attrs):
        # Extrair user_type se foi enviado na requisição
        user_type = None
        if 'user_type' in attrs:
            user_type = attrs.pop('user_type')
            
        # Chamar o método validate da classe pai para autenticar o usuário
        data = super().validate(attrs)
        
        # Adicionar dados extras na resposta
        data['user_id'] = self.user.id
        data['name'] = self.user.get_full_name() or self.user.username
        data['email'] = self.user.email
        
        # Se o tipo foi enviado pelo frontend e o usuário não tem tipo definido ou se
        # estamos forçando o uso do tipo selecionado no frontend, usar o tipo enviado
        if user_type and (not self.user.tipo or user_type == 'nutricionista'):
            data['tipo'] = user_type
            # Atualizar o tipo do usuário no banco de dados se necessário
            if not self.user.tipo or self.user.tipo != user_type:
                self.user.tipo = user_type
                self.user.save(update_fields=['tipo'])
        else:
            data['tipo'] = self.user.tipo  # 'cliente' ou 'nutricionista'
        
        return data
