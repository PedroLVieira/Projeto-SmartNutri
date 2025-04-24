# language: pt

Funcionalidade: Login do Nutricionista
  Como um nutricionista cadastrado no sistema
  Eu quero fazer login na plataforma
  Para poder gerenciar os planos alimentares dos meus pacientes

  Contexto:
    Dado que existe um nutricionista cadastrado
      | username                | email                   | password   | tipo          |
      | nutricionista.teste     | nutricionista@teste.com | Senha@123  | nutricionista |
    
  @api
  Cenário: Login com credenciais válidas
    Quando eu envio uma requisição POST para "/api/login/" com:
      | username                | password   |
      | nutricionista.teste     | Senha@123  |
    Então o código de status da resposta deve ser 200
    E a resposta deve conter um token de autenticação
    E a resposta deve conter os dados do nutricionista logado

  @api
  Cenário: Login com senha incorreta
    Quando eu envio uma requisição POST para "/api/login/" com:
      | username                | password      |
      | nutricionista.teste     | Senha@Errada  |
    Então o código de status da resposta deve ser 401
    E a resposta deve conter a mensagem de erro "Credenciais inválidas"

  @api
  Cenário: Login com username não cadastrado
    Quando eu envio uma requisição POST para "/api/login/" com:
      | username                | password   |
      | nao.existe              | Senha@123  |
    Então o código de status da resposta deve ser 401
    E a resposta deve conter a mensagem de erro "Credenciais inválidas"

  @web
  Cenário: Login na interface web do nutricionista
    Dado que estou na página de login "/nutricionista"
    Quando eu preencho o campo "username" com "nutricionista.teste"
    E eu preencho o campo "senha" com "Senha@123"
    E eu clico no botão "Entrar"
    Então devo ser redirecionado para a página "/dashboard-nutricionista"
    E devo ver a mensagem "Bem-vindo(a)"