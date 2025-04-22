from rest_framework import serializers
from planoalimentar.models import DiaSemana, PlanoAlimentar, Refeicao, ItemRefeicao
from user.models import CustomUser

class DiaSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaSemana
        fields = ['id', 'nome']

class ItemRefeicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemRefeicao
        fields = ['id', 'recomendado', 'substituicoes']

class RefeicaoSerializer(serializers.ModelSerializer):
    itens = ItemRefeicaoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Refeicao
        fields = ['id', 'nome', 'dia_semana', 'horario', 'itens']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['nome_display'] = instance.get_nome_display()
        return representation

class RefeicaoCompletoSerializer(serializers.ModelSerializer):
    itens = ItemRefeicaoSerializer(many=True)
    dia_semana = DiaSemanaSerializer(read_only=True)
    dia_semana_id = serializers.PrimaryKeyRelatedField(
        queryset=DiaSemana.objects.all(),
        source='dia_semana',
        write_only=True
    )
    
    class Meta:
        model = Refeicao
        fields = ['id', 'nome', 'dia_semana', 'dia_semana_id', 'horario', 'itens']
    
    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        refeicao = Refeicao.objects.create(**validated_data)
        
        for item_data in itens_data:
            ItemRefeicao.objects.create(refeicao=refeicao, **item_data)
        
        return refeicao
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['nome_display'] = instance.get_nome_display()
        return representation

class PlanoAlimentarListSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.CharField(source='cliente.username', read_only=True)
    nutricionista_nome = serializers.CharField(source='nutricionista.username', read_only=True)
    
    class Meta:
        model = PlanoAlimentar
        fields = ['id', 'nome', 'cliente', 'cliente_nome', 'nutricionista', 
                  'nutricionista_nome', 'data_criacao', 'data_atualizacao', 'ativo']

class PlanoAlimentarDetalhesSerializer(serializers.ModelSerializer):
    refeicoes = serializers.SerializerMethodField()
    cliente_nome = serializers.CharField(source='cliente.username', read_only=True)
    nutricionista_nome = serializers.CharField(source='nutricionista.username', read_only=True)
    
    class Meta:
        model = PlanoAlimentar
        fields = ['id', 'nome', 'cliente', 'cliente_nome', 'nutricionista', 
                  'nutricionista_nome', 'data_criacao', 'data_atualizacao', 
                  'ativo', 'refeicoes']
    
    def get_refeicoes(self, plano):
        # Organiza as refeições por dia da semana
        resultado = {}
        dias = DiaSemana.objects.all()
        
        for dia in dias:
            refeicoes = Refeicao.objects.filter(plano_alimentar=plano, dia_semana=dia)
            if refeicoes.exists():
                serializer = RefeicaoSerializer(refeicoes, many=True)
                resultado[dia.nome] = serializer.data
        
        return resultado

class PlanoAlimentarCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoAlimentar
        fields = ['id', 'nome', 'cliente', 'nutricionista', 'ativo']
    
    def validate(self, data):
        # Verifica se o cliente é realmente um cliente
        if data['cliente'].tipo != 'cliente':
            raise serializers.ValidationError("O usuário selecionado não é um cliente")
            
        # Verifica se o nutricionista é realmente um nutricionista
        if data['nutricionista'].tipo != 'nutricionista':
            raise serializers.ValidationError("O usuário selecionado não é um nutricionista")
            
        return data