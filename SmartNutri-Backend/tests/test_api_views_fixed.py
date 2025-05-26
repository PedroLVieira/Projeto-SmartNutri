from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from planoalimentar.models import PlanoAlimentar, DiaSemana, Refeicao
from datetime import time

User = get_user_model()


class UserAPITest(APITestCase):
    """Testes para as APIs de usuário"""
    
    def setUp(self):
        """Configuração inicial para os testes de API"""
        self.client = APIClient()
        self.user_data = {
            'username': 'testapi',
            'email': 'testapi@example.com',
            'password': 'TestPassword123',
            'cpf': '123.456.789-01',
            'tipo': 'cliente'
        }
    
    def test_create_user_via_api(self):
        """Testa criação de usuário via API"""
        response = self.client.post('/api/register/', self.user_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['email'], 'testapi@example.com')
        self.assertEqual(response.data['user']['tipo'], 'cliente')
        self.assertNotIn('password', response.data['user'])  # Password não deve aparecer na resposta
    
    def test_create_nutricionista_via_api(self):
        """Testa criação de nutricionista via API"""
        nutri_data = {
            'username': 'nutriapi',
            'email': 'nutri@example.com',
            'password': 'TestPassword123',
            'cpf': '987.654.321-01',
            'tipo': 'nutricionista'
        }
        
        response = self.client.post('/api/register/', nutri_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['tipo'], 'nutricionista')
    
    def test_login_via_api(self):
        """Testa login via API"""
        # Primeiro cria um usuário
        user = User.objects.create_user(
            username='api_login_test',
            email='apilogin@example.com',
            password='TestPassword123',
            tipo='cliente'
        )
        
        login_data = {
            'email': 'apilogin@example.com',
            'password': 'TestPassword123'
        }
        
        response = self.client.post('/api/login/', login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['id'], user.id)


class PlanoAlimentarAPITest(APITestCase):
    """Testes para as APIs de plano alimentar"""
    
    def setUp(self):
        """Configuração inicial para os testes de API"""
        self.client = APIClient()
        
        # Criar usuários
        self.cliente = User.objects.create_user(
            username='cliente_api',
            email='cliente.api@test.com',
            password='TestPassword123',
            tipo='cliente'
        )
        
        self.nutricionista = User.objects.create_user(
            username='nutri_api',
            email='nutri.api@test.com',
            password='TestPassword123',
            tipo='nutricionista'
        )
        
        # Gerar token para autenticação
        self.token = RefreshToken.for_user(self.nutricionista)
        self.access_token = str(self.token.access_token)
        
        # Criar dia da semana para testes
        self.segunda = DiaSemana.objects.create(nome="Segunda-feira")
    
    def test_create_plano_alimentar_authenticated(self):
        """Testa criação de plano alimentar autenticado"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        plano_data = {
            'nome': 'Plano API Test',
            'cliente': self.cliente.id,
            'nutricionista': self.nutricionista.id,
            'ativo': True
        }
        
        response = self.client.post('/api/planoalimentar/planos/', plano_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nome'], 'Plano API Test')
        self.assertEqual(response.data['cliente'], self.cliente.id)
    
    def test_create_plano_alimentar_unauthenticated(self):
        """Testa que não é possível criar plano sem autenticação"""
        plano_data = {
            'nome': 'Plano Sem Auth',
            'cliente': self.cliente.id,
            'nutricionista': self.nutricionista.id
        }
        
        response = self.client.post('/api/planoalimentar/planos/', plano_data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_planos_cliente(self):
        """Testa listagem de planos de um cliente"""
        # Criar plano para o cliente
        plano = PlanoAlimentar.objects.create(
            cliente=self.cliente,
            nutricionista=self.nutricionista,
            nome="Plano Listagem"
        )
        
        # Autenticar como cliente
        client_token = RefreshToken.for_user(self.cliente)
        client_access_token = str(client_token.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {client_access_token}')
        
        response = self.client.get(f'/api/planoalimentar/planos/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nome'], 'Plano Listagem')


class AuthenticationAPITest(APITestCase):
    """Testes específicos para autenticação via API"""
    
    def setUp(self):
        """Configuração inicial"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='auth_test',
            email='auth@test.com',
            password='TestPassword123',
            tipo='nutricionista'
        )
    
    def test_token_refresh(self):
        """Testa refresh de token JWT"""
        # Fazer login para obter tokens
        login_data = {
            'email': 'auth@test.com',
            'password': 'TestPassword123'
        }
        
        login_response = self.client.post('/api/login/', login_data)
        refresh_token = login_response.data['refresh']
        
        # Testar refresh do token
        refresh_data = {'refresh': refresh_token}
        response = self.client.post('/api/token/refresh/', refresh_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_protected_endpoint_with_valid_token(self):
        """Testa acesso a endpoint protegido com token válido"""
        # Gerar token
        token = RefreshToken.for_user(self.user)
        access_token = str(token.access_token)
        
        # Testar acesso com token válido
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get('/api/users/perfil/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_protected_endpoint_without_token(self):
        """Testa acesso a endpoint protegido sem token"""
        response = self.client.get('/api/users/perfil/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
