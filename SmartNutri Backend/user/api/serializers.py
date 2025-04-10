from rest_framework import serializers
from django.contrib.auth import authenticate
from user.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'cpf', 'password','tipo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data['username']
        password = data['password']

        # Autentica o usuário
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Credenciais inválidas.")
        if not user.is_active:
            raise serializers.ValidationError("Usuário inativo.")
        return {'user': user}  # Retorna o usuário validado
    
class HomepageSerializer(serializers.Serializer):
    message = serializers.CharField()
    status = serializers.CharField()
