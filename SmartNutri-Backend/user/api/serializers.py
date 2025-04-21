from rest_framework import serializers
from django.contrib.auth import authenticate
from user.models import CustomUser

# user/api/serializers.py - Classe UserSerializer atualizada
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'cpf', 'password', 'tipo']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'tipo': {'required': True},
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
