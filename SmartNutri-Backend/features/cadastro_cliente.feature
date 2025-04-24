# language: pt

Funcionalidade: Cadastro e Login de Cliente (Paciente)
  Como um potencial cliente
  Eu quero me cadastrar e fazer login no sistema SmartNutri
  Para poder acessar meus planos alimentares criados pelo nutricionista

  @api
  Cenário: Cadastro de cliente com dados válidos
    Quando eu envio uma requisição POST para "/api/clientes/" com:
      | username         | email             | password   | first_name | last_name | data_nascimento | cpf             | tipo    | sexo | altura | peso  |
      | cliente.teste    | cliente@teste.com | Senha@123  | Ana        | Silva     | 1990-01-01      | 111.222.333-44  | cliente | F    | 165    | 65.5  |
    Então o código de status da resposta deve ser 201
    E a resposta deve conter os dados do cliente cadastrado
    E o cliente deve ser criado no banco de dados

  @api
  Cenário: Login do cliente com credenciais válidas
    Dado que existe um cliente cadastrado
      | username         | email             | password   | tipo    |
      | cliente.teste    | cliente@teste.com | Senha@123  | cliente |
    Quando eu envio uma requisição POST para "/api/login/" com:
      | username         | password   |
      | cliente.teste    | Senha@123  |
    Então o código de status da resposta deve ser 200
    E a resposta deve conter um token de autenticação
    E a resposta deve conter os dados do cliente logado

  @web
  Cenário: Cadastro de cliente pela interface web
    Dado que estou na página de cadastro de cliente "/registro"
    Quando eu preencho o campo "email" com "novocliente@teste.com"
    E eu preencho o campo "username" com "novo.cliente"
    E eu preencho o campo "senha" com "Senha@123"
    E eu preencho o campo "confirmarSenha" com "Senha@123"
    E eu preencho o campo "firstName" com "Pedro"
    E eu preencho o campo "lastName" com "Santos"
    E eu preencho o campo "cpf" com "444.555.666-77"
    E eu preencho o campo "dataNascimento" com "1992-05-15"
    E eu seleciono "Masculino" no campo "sexo"
    E eu preencho o campo "altura" com "178"
    E eu preencho o campo "peso" com "80.2"
    E eu clico no botão "Cadastrar"
    Então devo ver a mensagem "Cadastro realizado com sucesso"
    E devo ser redirecionado para a página de login

  @web
  Cenário: Login do cliente pela interface web
    Dado que existe um cliente cadastrado
      | username         | email             | password   | tipo    |
      | cliente.teste    | cliente@teste.com | Senha@123  | cliente |
    E que estou na página de login do cliente "/cliente"
    Quando eu preencho o campo "username" com "cliente.teste"
    E eu preencho o campo "senha" com "Senha@123"
    E eu clico no botão "Entrar"
    Então devo ser redirecionado para a página "/dashboard-cliente"
    E devo ver a mensagem "Bem-vindo(a)"