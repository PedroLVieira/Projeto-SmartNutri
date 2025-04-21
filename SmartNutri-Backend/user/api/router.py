from rest_framework.routers import DefaultRouter
from .viewsets import RegisterViewSet, LoginViewSet, HomepageViewSet

router = DefaultRouter()
router.register('register', RegisterViewSet, basename="register")
router.register('login', LoginViewSet, basename="login")
router.register('home', HomepageViewSet, basename='homepage') 
router.register('home/nutricionista', HomepageViewSet, basename='homenutricionista')
router.register('home/cliente', HomepageViewSet, basename='homecliente') 
