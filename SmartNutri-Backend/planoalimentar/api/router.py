from rest_framework.routers import DefaultRouter
from .viewsets import DiaSemanaViewSet, PlanoAlimentarViewSet, RefeicaoViewSet

router = DefaultRouter()
router.register('dias-semana', DiaSemanaViewSet, basename='dias-semana')
router.register('planos', PlanoAlimentarViewSet, basename='planos')
router.register('refeicoes', RefeicaoViewSet, basename='refeicoes')