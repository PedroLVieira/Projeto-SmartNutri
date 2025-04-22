from django.contrib import admin
from .models import PlanoAlimentar, Refeicao, ItemRefeicao, DiaSemana

@admin.register(PlanoAlimentar)
class PlanoAlimentarAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'cliente', 'nutricionista', 'data_criacao', 'ativo')
    search_fields = ('nome', 'cliente__username', 'nutricionista__username')
    list_filter = ('data_criacao', 'ativo')

@admin.register(Refeicao)
class RefeicaoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'plano_alimentar', 'dia_semana', 'horario')
    search_fields = ('nome', 'plano_alimentar__nome', 'dia_semana__nome')
    list_filter = ('dia_semana', 'plano_alimentar')

@admin.register(ItemRefeicao)
class ItemRefeicaoAdmin(admin.ModelAdmin):
    list_display = ('id', 'refeicao', 'recomendado', 'substituicoes')
    search_fields = ('refeicao__nome', 'recomendado', 'substituicoes')

@admin.register(DiaSemana)
class DiaSemanaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')
    search_fields = ('nome',)
