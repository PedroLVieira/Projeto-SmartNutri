# language: pt

Funcionalidade: Gerenciamento de Plano Alimentar
  Como um nutricionista
  Eu quero criar e gerenciar planos alimentares
  Para ajudar meus pacientes a seguirem uma dieta adequada

  Contexto:
    Dado que existe um nutricionista autenticado
    E que existe um paciente cadastrado

  @api
  Cenário: Criar um novo plano alimentar
    Quando eu envio uma requisição POST para "/api/plano-alimentar/" com dados do plano alimentar:
      | nome           | cliente_id | nutricionista_id | ativo |
      | Dieta Low Carb | 1          | 2                | true  |
    Então o código de status da resposta deve ser 201
    E a resposta deve conter os dados do plano alimentar criado

  @api
  Cenário: Adicionar refeição ao plano alimentar
    Dado que existe um plano alimentar cadastrado
    E que existe um registro de dia da semana com nome "Segunda-feira"
    Quando eu envio uma requisição POST para "/api/plano-alimentar/{id}/refeicao/" com dados da refeição:
      | nome          | horario | dia_semana_id |
      | cafe_da_manha | 08:00   | 1             |
    Então o código de status da resposta deve ser 201
    E a resposta deve conter os dados da refeição adicionada

  @api
  Cenário: Adicionar item a uma refeição
    Dado que existe um plano alimentar cadastrado
    E que existe uma refeição cadastrada
    Quando eu envio uma requisição POST para "/api/refeicao/{id}/item/" com dados do item:
      | recomendado                                    | substituicoes                            |
      | 2 ovos mexidos, 1 fatia de pão integral, café | Omelete de claras, tapioca, chá verde    |
    Então o código de status da resposta deve ser 201
    E a resposta deve conter os dados do item adicionado

  @api
  Cenário: Listar planos alimentares de um paciente
    Dado que existe um plano alimentar cadastrado para o paciente
    Quando eu envio uma requisição GET para "/api/paciente/{id}/planos-alimentares/"
    Então o código de status da resposta deve ser 200
    E a resposta deve conter uma lista de planos alimentares

  @web
  Cenário: Criar plano alimentar pela interface web
    Dado que estou logado como nutricionista
    E estou na página de criação de plano alimentar
    Quando eu seleciono o paciente "João Silva"
    E eu preencho o campo "nome" com "Plano de Emagrecimento"
    E adiciono uma refeição com:
      | nome          | horario | dia_semana    | recomendado                  | substituicoes                |
      | cafe_da_manha | 08:00   | Segunda-feira | Ovo mexido, aveia e frutas   | Tapioca, iogurte com granola |
    E eu clico no botão "Salvar Plano"
    Então devo ver a mensagem "Plano alimentar criado com sucesso"
    E devo ser redirecionado para a página de detalhes do plano alimentar