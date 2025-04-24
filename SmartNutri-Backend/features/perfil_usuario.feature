# language: pt

Funcionalidade: Gerenciamento de Perfil de Usuário
  Como um usuário do sistema SmartNutri
  Eu quero atualizar e gerenciar meu perfil
  Para manter minhas informações atualizadas

  @api @nutricionista
  Cenário: Nutricionista visualiza seu perfil
    Dado que estou autenticado como nutricionista
    Quando eu envio uma requisição GET para "/api/nutricionista/perfil/"
    Então o código de status da resposta deve ser 200
    E a resposta deve conter os dados do meu perfil
    E a resposta deve incluir "username", "email", "first_name", "last_name", "cpf" e "tipo"

  @api @nutricionista
  Cenário: Nutricionista atualiza seu perfil
    Dado que estou autenticado como nutricionista
    Quando eu envio uma requisição PUT para "/api/nutricionista/perfil/" com:
      | first_name   | last_name | cpf             |
      | Nutricionista| Atualizado| 111.222.333-44  |
    Então o código de status da resposta deve ser 200
    E a resposta deve conter os dados atualizados do perfil

  @api @cliente
  Cenário: Cliente atualiza seus dados antropométricos
    Dado que estou autenticado como cliente
    Quando eu envio uma requisição PUT para "/api/cliente/perfil/" com:
      | peso  | altura | sexo |
      | 72.5  | 170    | M    |
    Então o código de status da resposta deve ser 200
    E a resposta deve conter os dados atualizados

  @web @nutricionista  
  Cenário: Nutricionista atualiza seu perfil pela interface web
    Dado que estou logado como nutricionista
    E estou na página de perfil "/perfil"
    Quando eu preencho o campo "firstName" com "Maria"
    E eu preencho o campo "lastName" com "Nutricionista"
    E eu preencho o campo "cpf" com "111.222.333-44"
    E eu carrego uma nova foto de perfil
    E eu clico no botão "Salvar Alterações"
    Então devo ver a mensagem "Perfil atualizado com sucesso"

  @web @cliente
  Cenário: Cliente atualiza seus dados pela interface web
    Dado que estou logado como cliente
    E estou na página de perfil do cliente "/paciente-perfil"
    Quando eu preencho o campo "altura" com "175"
    E eu preencho o campo "peso" com "68.0"
    E eu preencho o campo "sexo" com "M"
    E eu clico no botão "Atualizar Dados"
    Então devo ver a mensagem "Dados atualizados com sucesso"