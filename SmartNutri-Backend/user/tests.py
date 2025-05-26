from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from user.api.serializers import UserSerializer, LoginSerializer
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()


class CustomUserModelTest(TestCase):
    """Testes unitários para o model CustomUser"""
    
    def setUp(self):
        """Configuração inicial para os testes"""
        self.user_data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'password': 'TestPassword123',
            'cpf': '123.456.789-00',
            'tipo': 'cliente'
        }
    
    def test_create_user_successfully(self):
        """Testa criação de usuário com dados válidos"""
        user = User.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            password=self.user_data['password'],
            cpf=self.user_data['cpf'],
            tipo=self.user_data['tipo']
        )
        
        self.assertEqual(user.username, 'test_user')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.cpf, '123.456.789-00')
        self.assertEqual(user.tipo, 'cliente')
        self.assertTrue(user.check_password('TestPassword123'))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
    
    def test_create_nutricionista_user(self):
        """Testa criação de usuário nutricionista"""
        user = User.objects.create_user(
            username='nutricionista_test',
            email='nutri@example.com',
            password='TestPassword123',
            cpf='987.654.321-00',
            tipo='nutricionista'
        )
        
        self.assertEqual(user.tipo, 'nutricionista')
        self.assertEqual(user.username, 'nutricionista_test')
    
    def test_user_str_representation(self):
        """Testa a representação string do usuário"""
        user = User.objects.create_user(
            username='test_str',
            email='str@example.com',
            password='TestPassword123',
            tipo='cliente'
        )
        
        self.assertEqual(str(user), 'test_str')
    
    def test_unique_cpf_constraint(self):
        """Testa que CPF deve ser único"""
        # Cria primeiro usuário
        User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='TestPassword123',
            cpf='123.456.789-00',
            tipo='cliente'
        )
        
        # Tenta criar segundo usuário com mesmo CPF
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username='user2',
                email='user2@example.com',
                password='TestPassword123',
                cpf='123.456.789-00',  # CPF duplicado
                tipo='nutricionista'
            )


class UserSerializerTest(TestCase):
    """Testes unitários para UserSerializer"""
    
    def test_create_user_with_serializer(self):
        """Testa criação de usuário através do serializer"""
        data = {
            'email': 'serializer@example.com',
            'password': 'TestPassword123',
            'cpf': '111.222.333-44',
            'tipo': 'cliente',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid(), f"Serializer errors: {serializer.errors}")
        
        user = serializer.save()
        self.assertEqual(user.email, 'serializer@example.com')
        self.assertEqual(user.username, 'serializer')  # Username gerado do email
        self.assertEqual(user.tipo, 'cliente')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')
        self.assertTrue(user.check_password('TestPassword123'))
    
    def test_serializer_validation_required_fields(self):
        """Testa validação de campos obrigatórios"""
        data = {
            'password': 'TestPassword123',
            # email e tipo são obrigatórios
        }
        
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        self.assertIn('tipo', serializer.errors)
    
    def test_serializer_invalid_tipo(self):
        """Testa validação de tipo inválido"""
        data = {
            'email': 'invalid@example.com',
            'password': 'TestPassword123',
            'tipo': 'invalid_type'
        }
        
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('tipo', serializer.errors)


class LoginSerializerTest(TestCase):
    """Testes unitários para LoginSerializer"""
    
    def setUp(self):
        """Cria usuário para testes de login"""
        self.user = User.objects.create_user(
            username='login_test',
            email='login@example.com',
            password='TestPassword123',
            tipo='cliente'
        )
    
    def test_valid_login(self):
        """Testa login com credenciais válidas"""
        data = {
            'email': 'login@example.com',  # LoginSerializer usa email
            'password': 'TestPassword123'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['user'], self.user)
    
    def test_invalid_credentials(self):
        """Testa login com credenciais inválidas"""
        data = {
            'email': 'login@example.com',
            'password': 'WrongPassword'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_nonexistent_user(self):
        """Testa login com usuário inexistente"""
        data = {
            'email': 'nonexistent@example.com',
            'password': 'TestPassword123'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_inactive_user(self):
        """Testa login com usuário inativo"""
        # Criar usuário inativo
        inactive_user = User.objects.create_user(
            username='inactive_user',
            email='inactive@example.com',
            password='TestPassword123',
            tipo='cliente'
        )
        inactive_user.is_active = False
        inactive_user.save()
        
        data = {
            'email': 'inactive@example.com',
            'password': 'TestPassword123'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
