from django.test import TestCase
from django.contrib.auth import get_user_model
from planoalimentar.models import PlanoAlimentar, DiaSemana, Refeicao, ItemRefeicao
from datetime import time

User = get_user_model()


class DiaSemanaModelTest(TestCase):
    """Testes unitários para o model DiaSemana"""
    
    def test_create_dia_semana(self):
        """Testa criação de dia da semana"""
        dia = DiaSemana.objects.create(nome="Segunda-feira")
        
        self.assertEqual(dia.nome, "Segunda-feira")
        self.assertEqual(str(dia), "Segunda-feira")


class PlanoAlimentarModelTest(TestCase):
    """Testes unitários para o model PlanoAlimentar"""
    
    def setUp(self):
        """Configuração inicial para os testes"""
        self.cliente = User.objects.create_user(
            username='cliente_test',
            email='cliente@test.com',
            password='TestPassword123',
            tipo='cliente'
        )
        
        self.nutricionista = User.objects.create_user(
            username='nutri_test',
            email='nutri@test.com',
            password='TestPassword123',
            tipo='nutricionista'
        )
    
    def test_create_plano_alimentar(self):
        """Testa criação de plano alimentar"""
        plano = PlanoAlimentar.objects.create(
            cliente=self.cliente,
            nutricionista=self.nutricionista,
            nome="Plano de Emagrecimento",
            ativo=True
        )
        
        self.assertEqual(plano.cliente, self.cliente)
        self.assertEqual(plano.nutricionista, self.nutricionista)
        self.assertEqual(plano.nome, "Plano de Emagrecimento")
        self.assertTrue(plano.ativo)
        self.assertIsNotNone(plano.data_criacao)
        self.assertIsNotNone(plano.data_atualizacao)
    
    def test_plano_alimentar_str_representation(self):
        """Testa a representação string do plano alimentar"""
        plano = PlanoAlimentar.objects.create(
            cliente=self.cliente,
            nutricionista=self.nutricionista,
            nome="Plano Teste"
        )
        
        expected_str = f"Plano de {self.cliente.username} por {self.nutricionista.username}"
        self.assertEqual(str(plano), expected_str)
    
    def test_plano_alimentar_default_ativo(self):
        """Testa que plano alimentar é ativo por padrão"""
        plano = PlanoAlimentar.objects.create(
            cliente=self.cliente,
            nutricionista=self.nutricionista,
            nome="Plano Default"
        )
        
        self.assertTrue(plano.ativo)


class RefeicaoModelTest(TestCase):
    """Testes unitários para o model Refeicao"""
    
    def setUp(self):
        """Configuração inicial para os testes"""
        self.cliente = User.objects.create_user(
            username='cliente_refeicao',
            email='cliente.refeicao@test.com',
            password='TestPassword123',
            tipo='cliente'
        )
        
        self.nutricionista = User.objects.create_user(
            username='nutri_refeicao',
            email='nutri.refeicao@test.com',
            password='TestPassword123',
            tipo='nutricionista'
        )
        
        self.plano = PlanoAlimentar.objects.create(
            cliente=self.cliente,
            nutricionista=self.nutricionista,
            nome="Plano para Refeição"
        )
        
        self.dia_semana = DiaSemana.objects.create(nome="Segunda-feira")
    
    def test_create_refeicao(self):
        """Testa criação de refeição"""
        refeicao = Refeicao.objects.create(
            nome='cafe_da_manha',
            plano_alimentar=self.plano,
            dia_semana=self.dia_semana,
            horario=time(8, 0)  # 08:00
        )
        
        self.assertEqual(refeicao.nome, 'cafe_da_manha')
        self.assertEqual(refeicao.plano_alimentar, self.plano)
        self.assertEqual(refeicao.dia_semana, self.dia_semana)
        self.assertEqual(refeicao.horario, time(8, 0))
    
    def test_refeicao_choices(self):
        """Testa as opções disponíveis para tipos de refeição"""
        tipos_validos = [
            'cafe_da_manha',
            'lanche_manha', 
            'almoco',
            'lanche_tarde',
            'jantar',
            'ceia'
        ]
        
        for tipo in tipos_validos:
            refeicao = Refeicao.objects.create(
                nome=tipo,
                plano_alimentar=self.plano,
                dia_semana=self.dia_semana
            )
            self.assertEqual(refeicao.nome, tipo)
    
    def test_refeicao_str_representation(self):
        """Testa a representação string da refeição"""
        refeicao = Refeicao.objects.create(
            nome='almoco',
            plano_alimentar=self.plano,
            dia_semana=self.dia_semana
        )
        
        expected_str = f"Almoço - Segunda-feira"
        self.assertEqual(str(refeicao), expected_str)


class ItemRefeicaoModelTest(TestCase):
    """Testes unitários para o model ItemRefeicao"""
    
    def setUp(self):
        """Configuração inicial para os testes"""
        self.cliente = User.objects.create_user(
            username='cliente_item',
            email='cliente.item@test.com',
            password='TestPassword123',
            tipo='cliente'
        )
        
        self.nutricionista = User.objects.create_user(
            username='nutri_item',
            email='nutri.item@test.com',
            password='TestPassword123',
            tipo='nutricionista'
        )
        
        self.plano = PlanoAlimentar.objects.create(
            cliente=self.cliente,
            nutricionista=self.nutricionista,
            nome="Plano para Item"
        )
        
        self.dia_semana = DiaSemana.objects.create(nome="Terça-feira")
        
        self.refeicao = Refeicao.objects.create(
            nome='cafe_da_manha',
            plano_alimentar=self.plano,
            dia_semana=self.dia_semana,
            horario=time(8, 30)
        )
    
    def test_create_item_refeicao(self):
        """Testa criação de item de refeição"""
        item = ItemRefeicao.objects.create(
            refeicao=self.refeicao,
            recomendado="2 ovos mexidos, 1 fatia de pão integral, café",
            substituicoes="Omelete de claras, tapioca, chá verde"
        )
        
        self.assertEqual(item.refeicao, self.refeicao)
        self.assertEqual(item.recomendado, "2 ovos mexidos, 1 fatia de pão integral, café")
        self.assertEqual(item.substituicoes, "Omelete de claras, tapioca, chá verde")
    
    def test_item_refeicao_str_representation(self):
        """Testa a representação string do item de refeição"""
        item = ItemRefeicao.objects.create(
            refeicao=self.refeicao,
            recomendado="Teste",
            substituicoes="Teste substituto"
        )
        
        expected_str = f"Item de {self.refeicao}"
        self.assertEqual(str(item), expected_str)


class PlanoAlimentarIntegrationTest(TestCase):
    """Testes de integração entre os models do plano alimentar"""
    
    def setUp(self):
        """Configuração inicial para os testes de integração"""
        self.cliente = User.objects.create_user(
            username='integration_cliente',
            email='integration.cliente@test.com',
            password='TestPassword123',
            tipo='cliente'
        )
        
        self.nutricionista = User.objects.create_user(
            username='integration_nutri',
            email='integration.nutri@test.com',
            password='TestPassword123',
            tipo='nutricionista'
        )
    
    def test_complete_plano_alimentar_creation(self):
        """Testa criação completa de um plano alimentar com refeições e itens"""
        # Criar plano
        plano = PlanoAlimentar.objects.create(
            cliente=self.cliente,
            nutricionista=self.nutricionista,
            nome="Plano Completo"
        )
        
        # Criar dia da semana
        segunda = DiaSemana.objects.create(nome="Segunda-feira")
        
        # Criar refeição
        cafe_manha = Refeicao.objects.create(
            nome='cafe_da_manha',
            plano_alimentar=plano,
            dia_semana=segunda,
            horario=time(8, 0)
        )
        
        # Criar item da refeição
        item = ItemRefeicao.objects.create(
            refeicao=cafe_manha,
            recomendado="Aveia com frutas",
            substituicoes="Granola com iogurte"
        )
        
        # Verificar relacionamentos
        self.assertEqual(plano.refeicoes.count(), 1)
        self.assertEqual(cafe_manha.itens.count(), 1)
        self.assertEqual(plano.refeicoes.first(), cafe_manha)
        self.assertEqual(cafe_manha.itens.first(), item)
        
        # Verificar que o cliente tem o plano
        self.assertEqual(self.cliente.planos_alimentares.count(), 1)
        self.assertEqual(self.cliente.planos_alimentares.first(), plano)
        
        # Verificar que o nutricionista criou o plano  
        self.assertEqual(self.nutricionista.planos_criados.count(), 1)
        self.assertEqual(self.nutricionista.planos_criados.first(), plano)
