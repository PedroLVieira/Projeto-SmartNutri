from django.db import models
from user.models import CustomUser

class DiaSemana(models.Model):
    nome = models.CharField(max_length=20)
    
    def __str__(self):
        return self.nome

class PlanoAlimentar(models.Model):
    cliente = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='planos_alimentares')
    nutricionista = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='planos_criados')
    nome = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Plano de {self.cliente.username} por {self.nutricionista.username}"

class Refeicao(models.Model):
    TIPOS_REFEICAO = [
        ('cafe_da_manha', 'Café da manhã'),
        ('lanche_manha', 'Lanche da manhã'),
        ('almoco', 'Almoço'),
        ('lanche_tarde', 'Lanche da tarde'),
        ('jantar', 'Jantar'),
        ('ceia', 'Ceia'),
    ]
    
    nome = models.CharField(max_length=50, choices=TIPOS_REFEICAO)
    plano_alimentar = models.ForeignKey(PlanoAlimentar, on_delete=models.CASCADE, related_name='refeicoes')
    dia_semana = models.ForeignKey(DiaSemana, on_delete=models.CASCADE)
    horario = models.TimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.get_nome_display()} - {self.dia_semana}"

class ItemRefeicao(models.Model):
    refeicao = models.ForeignKey(Refeicao, on_delete=models.CASCADE, related_name='itens')
    recomendado = models.TextField()
    substituicoes = models.TextField()
    
    def __str__(self):
        return f"Item de {self.refeicao}"
