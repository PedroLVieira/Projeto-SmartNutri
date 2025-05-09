from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from planoalimentar.models import DiaSemana, PlanoAlimentar, Refeicao, ItemRefeicao
from user.models import CustomUser
from .serializers import (
    DiaSemanaSerializer,
    ItemRefeicaoSerializer,
    RefeicaoSerializer,
    RefeicaoCompletoSerializer,
    PlanoAlimentarListSerializer,
    PlanoAlimentarDetalhesSerializer,
    PlanoAlimentarCreateSerializer
)

class DiaSemanaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DiaSemana.objects.all()
    serializer_class = DiaSemanaSerializer
    permission_classes = [IsAuthenticated]

class PlanoAlimentarViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtra planos diferentes dependendo do tipo de usuário:
        - Nutricionistas veem seus planos criados
        - Clientes veem planos atribuídos a eles
        """
        user = self.request.user
        
        if user.tipo == 'nutricionista':
            return PlanoAlimentar.objects.filter(nutricionista=user)
        elif user.tipo == 'cliente':
            # Cliente pode ver todos seus planos, ativos ou não, ordenados por data de criação
            return PlanoAlimentar.objects.filter(cliente=user).order_by('-data_criacao')
        return PlanoAlimentar.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PlanoAlimentarDetalhesSerializer
        elif self.action == 'create':
            return PlanoAlimentarCreateSerializer
        return PlanoAlimentarListSerializer
    
    @action(detail=True, methods=['get'])
    def por_dia_semana(self, request, pk=None):
        """
        Retorna as refeições de um plano alimentar organizado por dia da semana
        """
        plano = self.get_object()
        dias = DiaSemana.objects.all()
        
        resultado = {}
        for dia in dias:
            refeicoes = Refeicao.objects.filter(plano_alimentar=plano, dia_semana=dia)
            if refeicoes.exists():
                refeicoes_data = []
                for refeicao in refeicoes:
                    refeicao_data = RefeicaoSerializer(refeicao).data
                    
                    # Busca itens para cada refeição
                    itens = ItemRefeicao.objects.filter(refeicao=refeicao)
                    if itens.exists():
                        item = itens.first()  # Assume um item por refeição conforme frontend atual
                        refeicao_data['refeicao'] = refeicao.get_nome_display()
                        refeicao_data['recomendado'] = item.recomendado
                        refeicao_data['substituicoes'] = item.substituicoes
                        refeicoes_data.append(refeicao_data)
                
                resultado[dia.nome] = refeicoes_data
        
        return Response(resultado)
    
    @action(detail=False, methods=['get'])
    def meu_plano_atual(self, request):
        """
        Retorna o plano alimentar ativo do cliente logado
        """
        user = request.user
        if user.tipo != 'cliente':
            return Response(
                {"detail": "Apenas clientes podem acessar esta rota"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Tenta buscar qualquer plano ativo do cliente, ordenado por data de criação
            planos = PlanoAlimentar.objects.filter(cliente=user, ativo=True).order_by('-data_criacao')
            
            if not planos.exists():
                return Response(
                    {"detail": "Nenhum plano alimentar ativo encontrado"},
                    status=status.HTTP_404_NOT_FOUND
                )
                
            # Pega o plano mais recente
            plano = planos.first()
            
            # Busca refeições organizadas por dia da semana
            dias = DiaSemana.objects.all()
            resultado = {}
            
            for dia in dias:
                refeicoes = Refeicao.objects.filter(plano_alimentar=plano, dia_semana=dia)
                if refeicoes.exists():
                    refeicoes_data = []
                    for refeicao in refeicoes:
                        refeicao_data = RefeicaoSerializer(refeicao).data
                        
                        # Busca itens para cada refeição
                        itens = ItemRefeicao.objects.filter(refeicao=refeicao)
                        if itens.exists():
                            item = itens.first()
                            refeicao_data['refeicao'] = refeicao.get_nome_display()
                            refeicao_data['recomendado'] = item.recomendado
                            refeicao_data['substituicoes'] = item.substituicoes
                            refeicoes_data.append(refeicao_data)
                    
                    resultado[dia.nome] = refeicoes_data
            
            # Se não encontrou nenhuma refeição em nenhum dia, pelo menos retorna a estrutura vazia
            if not resultado:
                return Response(
                    {"detail": "Este plano alimentar ainda não possui refeições cadastradas"},
                    status=status.HTTP_404_NOT_FOUND
                )
                
            return Response(resultado)
        except Exception as e:
            return Response(
                {"detail": f"Erro ao buscar plano alimentar: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def planos_por_cliente(self, request):
        """
        Para nutricionistas: lista os planos de um cliente específico
        """
        user = request.user
        if user.tipo != 'nutricionista':
            return Response(
                {"detail": "Apenas nutricionistas podem acessar esta rota"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        cliente_id = request.query_params.get('cliente_id')
        if not cliente_id:
            return Response(
                {"detail": "É necessário fornecer um ID de cliente"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cliente = CustomUser.objects.get(id=cliente_id, tipo='cliente')
            planos = PlanoAlimentar.objects.filter(cliente=cliente, nutricionista=user)
            serializer = PlanoAlimentarListSerializer(planos, many=True)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response(
                {"detail": "Cliente não encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

class RefeicaoViewSet(viewsets.ModelViewSet):
    serializer_class = RefeicaoCompletoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Refeicao.objects.filter(
            plano_alimentar__in=PlanoAlimentar.objects.filter(
                nutricionista=self.request.user
            )
        )
    
    def perform_create(self, serializer):
        plano_id = self.request.data.get('plano_alimentar')
        plano = get_object_or_404(PlanoAlimentar, id=plano_id, nutricionista=self.request.user)
        serializer.save(plano_alimentar=plano)
    
    @action(detail=False, methods=['post'])
    def criar_com_item(self, request):
        """
        Cria uma refeição com seu item em uma única requisição
        """
        plano_id = request.data.get('plano_alimentar')
        dia_id = request.data.get('dia_semana')
        nome = request.data.get('nome')
        recomendado = request.data.get('recomendado')
        substituicoes = request.data.get('substituicoes', '')
        
        # Validações
        if not all([plano_id, dia_id, nome, recomendado]):
            return Response(
                {"detail": "Dados incompletos para criar refeição"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Busca o plano e verifica permissão
            plano = PlanoAlimentar.objects.get(id=plano_id)
            if plano.nutricionista != request.user and not request.user.is_superuser:
                return Response(
                    {"detail": "Você não tem permissão para editar este plano"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Cria a refeição
            dia = get_object_or_404(DiaSemana, id=dia_id)
            refeicao = Refeicao.objects.create(
                plano_alimentar=plano,
                dia_semana=dia,
                nome=nome
            )
            
            # Cria o item da refeição
            item = ItemRefeicao.objects.create(
                refeicao=refeicao,
                recomendado=recomendado,
                substituicoes=substituicoes
            )
            
            return Response({
                'id': refeicao.id,
                'plano_alimentar': plano.id,
                'dia_semana': dia.id,
                'dia_semana_nome': dia.nome,
                'nome': refeicao.nome,
                'nome_display': refeicao.get_nome_display(),
                'item': {
                    'id': item.id,
                    'recomendado': item.recomendado,
                    'substituicoes': item.substituicoes
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )