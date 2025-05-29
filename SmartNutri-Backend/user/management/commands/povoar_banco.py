from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from planoalimentar.models import DiaSemana, PlanoAlimentar, Refeicao, ItemRefeicao
from datetime import time
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Povoa o banco de dados com dados de teste'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando povoamento do banco de dados...'))
        
        # Criar dias da semana
        self.criar_dias_semana()
        
        # Criar usuários específicos
        self.criar_usuarios_especificos()
        
        # Criar usuários adicionais
        self.criar_usuarios_adicionais()
        
        # Criar planos alimentares
        self.criar_planos_alimentares()
        
        self.stdout.write(self.style.SUCCESS('Banco de dados povoado com sucesso!'))

    def criar_dias_semana(self):
        dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']
        
        for dia in dias:
            dia_obj, created = DiaSemana.objects.get_or_create(nome=dia)
            if created:
                self.stdout.write(f'Dia da semana criado: {dia}')

    def criar_usuarios_especificos(self):
        # Nutricionista específico
        nutri_email = 'nutri@teste.com'
        if not User.objects.filter(email=nutri_email).exists():
            nutricionista = User.objects.create_user(
                username='nutricionista_teste',
                email=nutri_email,
                password='123456',
                first_name='Dr. Maria',
                last_name='Silva',
                tipo='nutricionista',
                cpf='123.456.789-01'
            )
            self.stdout.write(f'Nutricionista criado: {nutri_email}')
        else:
            self.stdout.write(f'Nutricionista já existe: {nutri_email}')

        # Cliente específico
        cliente_email = 'cliente@teste.com'
        if not User.objects.filter(email=cliente_email).exists():
            cliente = User.objects.create_user(
                username='cliente_teste',
                email=cliente_email,
                password='123456',
                first_name='João',
                last_name='Santos',
                tipo='cliente',
                cpf='987.654.321-09'
            )
            self.stdout.write(f'Cliente criado: {cliente_email}')
        else:
            self.stdout.write(f'Cliente já existe: {cliente_email}')

    def criar_usuarios_adicionais(self):
        # Criar nutricionistas adicionais
        nutricionistas_data = [
            {
                'username': 'dra_ana_costa',
                'email': 'ana.costa@smartnutri.com',
                'first_name': 'Ana',
                'last_name': 'Costa',
                'cpf': '111.222.333-44'
            },
            {
                'username': 'dr_carlos_oliveira',
                'email': 'carlos.oliveira@smartnutri.com',
                'first_name': 'Carlos',
                'last_name': 'Oliveira',
                'cpf': '555.666.777-88'
            },
            {
                'username': 'dra_fernanda_lima',
                'email': 'fernanda.lima@smartnutri.com',
                'first_name': 'Fernanda',
                'last_name': 'Lima',
                'cpf': '999.888.777-66'
            }
        ]

        for nutri_data in nutricionistas_data:
            if not User.objects.filter(email=nutri_data['email']).exists():
                User.objects.create_user(
                    username=nutri_data['username'],
                    email=nutri_data['email'],
                    password='senha123',
                    first_name=nutri_data['first_name'],
                    last_name=nutri_data['last_name'],
                    tipo='nutricionista',
                    cpf=nutri_data['cpf']
                )
                self.stdout.write(f'Nutricionista criado: {nutri_data["email"]}')

        # Criar clientes adicionais
        clientes_data = [
            {
                'username': 'pedro_santos',
                'email': 'pedro.santos@email.com',
                'first_name': 'Pedro',
                'last_name': 'Santos',
                'cpf': '123.789.456-12'
            },
            {
                'username': 'maria_souza',
                'email': 'maria.souza@email.com',
                'first_name': 'Maria',
                'last_name': 'Souza',
                'cpf': '456.123.789-34'
            },
            {
                'username': 'lucas_ferreira',
                'email': 'lucas.ferreira@email.com',
                'first_name': 'Lucas',
                'last_name': 'Ferreira',
                'cpf': '789.456.123-56'
            },
            {
                'username': 'ana_rodrigues',
                'email': 'ana.rodrigues@email.com',
                'first_name': 'Ana',
                'last_name': 'Rodrigues',
                'cpf': '321.654.987-78'
            },
            {
                'username': 'carlos_almeida',
                'email': 'carlos.almeida@email.com',
                'first_name': 'Carlos',
                'last_name': 'Almeida',
                'cpf': '654.321.987-90'
            }
        ]

        for cliente_data in clientes_data:
            if not User.objects.filter(email=cliente_data['email']).exists():
                User.objects.create_user(
                    username=cliente_data['username'],
                    email=cliente_data['email'],
                    password='senha123',
                    first_name=cliente_data['first_name'],
                    last_name=cliente_data['last_name'],
                    tipo='cliente',
                    cpf=cliente_data['cpf']
                )
                self.stdout.write(f'Cliente criado: {cliente_data["email"]}')

    def criar_planos_alimentares(self):
        nutricionistas = User.objects.filter(tipo='nutricionista')
        clientes = User.objects.filter(tipo='cliente')
        dias_semana = DiaSemana.objects.all()

        if not nutricionistas.exists() or not clientes.exists():
            self.stdout.write(self.style.WARNING('Não há nutricionistas ou clientes suficientes para criar planos'))
            return

        # Criar alguns planos alimentares de exemplo
        planos_exemplo = [
            {
                'nome': 'Plano de Emagrecimento',
                'refeicoes_exemplo': {
                    'cafe_da_manha': {
                        'recomendado': '1 fatia de pão integral + 1 ovo mexido + 1 copo de leite desnatado',
                        'substituicoes': 'Pão integral pode ser substituído por 2 torradas integrais ou 1 tapioca pequena'
                    },
                    'lanche_manha': {
                        'recomendado': '1 fruta (maçã, pera ou banana) + 10 castanhas',
                        'substituicoes': 'Castanhas podem ser substituídas por amêndoas ou nozes'
                    },
                    'almoco': {
                        'recomendado': '1 prato de salada + 1 filé de frango grelhado + 2 colheres de arroz integral + 1 concha de feijão',
                        'substituicoes': 'Frango pode ser substituído por peixe grelhado ou tofu'
                    },
                    'lanche_tarde': {
                        'recomendado': '1 iogurte natural + 1 colher de granola',
                        'substituicoes': 'Granola pode ser substituída por aveia em flocos'
                    },
                    'jantar': {
                        'recomendado': '1 sopa de legumes + 1 fatia de pão integral',
                        'substituicoes': 'Sopa pode ser substituída por salada + proteína magra'
                    }
                }
            },
            {
                'nome': 'Plano de Ganho de Massa',
                'refeicoes_exemplo': {
                    'cafe_da_manha': {
                        'recomendado': '2 fatias de pão integral + 2 ovos mexidos + 1 copo de leite integral + 1 banana',
                        'substituicoes': 'Leite integral pode ser substituído por vitamina de frutas'
                    },
                    'lanche_manha': {
                        'recomendado': '1 vitamina de frutas com whey protein + 1 punhado de castanhas',
                        'substituicoes': 'Whey pode ser substituído por leite em pó'
                    },
                    'almoco': {
                        'recomendado': '1 prato de salada + 1 filé de carne vermelha + 3 colheres de arroz + 1 concha de feijão + 1 batata doce',
                        'substituicoes': 'Carne vermelha pode ser substituída por frango ou peixe'
                    },
                    'lanche_tarde': {
                        'recomendado': '1 sanduíche natural + 1 suco natural',
                        'substituicoes': 'Sanduíche pode ser substituído por vitamina de frutas'
                    },
                    'jantar': {
                        'recomendado': '1 filé de peixe + 2 colheres de arroz + legumes refogados',
                        'substituicoes': 'Peixe pode ser substituído por frango grelhado'
                    }
                }
            }
        ]

        # Criar planos para alguns clientes
        for i, cliente in enumerate(clientes[:3]):  # Primeiros 3 clientes
            nutricionista = random.choice(nutricionistas)
            plano_data = planos_exemplo[i % len(planos_exemplo)]
            
            plano = PlanoAlimentar.objects.create(
                cliente=cliente,
                nutricionista=nutricionista,
                nome=plano_data['nome']
            )

            # Criar refeições para cada dia da semana
            for dia in dias_semana:
                for tipo_refeicao, dados_refeicao in plano_data['refeicoes_exemplo'].items():
                    horarios = {
                        'cafe_da_manha': time(7, 0),
                        'lanche_manha': time(10, 0),
                        'almoco': time(12, 30),
                        'lanche_tarde': time(15, 30),
                        'jantar': time(19, 0),
                        'ceia': time(21, 30)
                    }
                    
                    refeicao = Refeicao.objects.create(
                        nome=tipo_refeicao,
                        plano_alimentar=plano,
                        dia_semana=dia,
                        horario=horarios.get(tipo_refeicao, time(12, 0))
                    )

                    ItemRefeicao.objects.create(
                        refeicao=refeicao,
                        recomendado=dados_refeicao['recomendado'],
                        substituicoes=dados_refeicao['substituicoes']
                    )

            self.stdout.write(f'Plano alimentar criado para {cliente.username}: {plano_data["nome"]}')
