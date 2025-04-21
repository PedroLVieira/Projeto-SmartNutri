from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    cpf = models.CharField(max_length=14, unique=True, blank=True, null=True)
    TIPO_USUARIO = [('cliente', 'Cliente'),('nutricionista', 'Nutricionista')]
    tipo = models.CharField(max_length=15, choices=TIPO_USUARIO)
    
    def __str__(self):
        return self.username