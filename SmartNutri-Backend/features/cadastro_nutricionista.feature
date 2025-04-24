# language: pt

Funcionalidade: Cadastro de Nutricionista
  Como um profissional de nutrição
  Eu quero me cadastrar no sistema SmartNutri
  Para poder gerenciar planos alimentares para meus pacientes

  @api
  Cenário: Cadastro com dados válidos
    Quando eu envio uma requisição POST para "/api/nutricionistas/" com:
      | username                | email                   | password   | first_name | last_name | cpf             | tipo          |
      | novo.nutricionista      | novo@nutricionista.com  | Senha@123  | Carlos     | Silva     | 123.456.789-10  | nutricionista  |
    Então o código de status da resposta deve ser 201
    E a resposta deve conter os dados do nutricionista cadastrado
    E o nutricionista deve ser criado no banco de dados

  @api
  Cenário: Cadastro com email já existente
    Dado que existe um nutricionista cadastrado
      | username                | email                   | password   |
      | nutricionista.teste     | nutricionista@teste.com | Senha@123  |
    Quando eu envio uma requisição POST para "/api/nutricionistas/" com:
      | username                | email                   | password   | first_name | last_name | cpf             | tipo          |
      | outro.nutricionista     | nutricionista@teste.com | Senha@123  | Carlos     | Silva     | 109.876.543-21  | nutricionista  |
    Então o código de status da resposta deve ser 400
    E a resposta deve conter a mensagem de erro "Email já está em uso"

  @api
  Cenário: Cadastro com CPF inválido
    Quando eu envio uma requisição POST para "/api/nutricionistas/" com:
      | username                | email                   | password   | first_name | last_name | cpf             | tipo          |
      | novo.nutricionista      | novo@nutricionista.com  | Senha@123  | Carlos     | Silva     | 123-456         | nutricionista  |
    Então o código de status da resposta deve ser 400
    E a resposta deve conter a mensagem de erro "CPF inválido"

  @web
  Cenário: Cadastro pela interface web
    Dado que estou na página de cadastro de nutricionista "/cadastro-nutricionista"
    Quando eu preencho o campo "email" com "web@nutricionista.com"
    E eu preencho o campo "username" com "web.nutricionista"
    E eu preencho o campo "senha" com "Senha@123"
    E eu preencho o campo "confirmarSenha" com "Senha@123"
    E eu preencho o campo "firstName" com "Web"
    E eu preencho o campo "lastName" com "Nutricionista"
    E eu preencho o campo "cpf" com "987.654.321-00"
    E eu clico no botão "Cadastrar"
    Então devo ser redirecionado para a página "/nutricionista"
    E devo ver a mensagem "Cadastro realizado com sucesso"