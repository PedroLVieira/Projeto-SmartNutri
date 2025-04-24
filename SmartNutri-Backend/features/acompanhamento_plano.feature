# language: pt

Funcionalidade: Acompanhamento de Plano Alimentar pelo Cliente
  Como um cliente do sistema SmartNutri
  Eu quero visualizar e acompanhar meu plano alimentar
  Para conseguir seguir corretamente as recomendações do nutricionista

  Contexto:
    Dado que estou autenticado como cliente
    E que tenho um plano alimentar atribuído a mim

  @api
  Cenário: Visualizar todos meus planos alimentares
    Quando eu envio uma requisição GET para "/api/cliente/planos-alimentares/"
    Então o código de status da resposta deve ser 200
    E a resposta deve conter uma lista dos meus planos alimentares
    E cada plano deve conter os campos básicos "id", "nome", "data_criacao" e "ativo"

  @api
  Cenário: Visualizar detalhes de um plano alimentar específico
    Quando eu envio uma requisição GET para "/api/plano-alimentar/{id}/"
    Então o código de status da resposta deve ser 200
    E a resposta deve conter os detalhes completos do plano alimentar
    E a resposta deve incluir todas as refeições do plano com seus dias da semana e horários

  @api
  Cenário: Visualizar detalhes de uma refeição específica
    Dado que o plano alimentar tem uma refeição "cafe_da_manha" cadastrada
    Quando eu envio uma requisição GET para "/api/refeicao/{id}/"
    Então o código de status da resposta deve ser 200
    E a resposta deve conter os detalhes da refeição
    E a resposta deve incluir todos os itens da refeição com recomendações e substituições

  @api
  Cenário: Registrar o cumprimento de uma refeição do plano
    Quando eu envio uma requisição POST para "/api/refeicao/{refeicao_id}/registro/" com:
      | cumprido | observacao                       |
      | true     | Segui todas as recomendações     |
    Então o código de status da resposta deve ser 201
    E a resposta deve confirmar o registro da refeição

  @web
  Cenário: Cliente visualiza seu plano alimentar atual
    Dado que estou logado como cliente
    Quando eu acesso a página "/plano-alimentar"
    Então devo ver o nome do meu plano alimentar atual
    E devo ver a lista de refeições organizadas por dias da semana
    E cada refeição deve mostrar o horário e os alimentos recomendados
    E cada refeição deve mostrar as substituições permitidas

  @web
  Cenário: Cliente marca uma refeição como realizada
    Dado que estou logado como cliente
    E estou na página do meu plano alimentar "/plano-alimentar"
    Quando eu clico no botão "Marcar como realizada" na refeição "Almoço"
    E eu preencho o campo "observacao" com "Segui o plano, mas adicionei uma fruta extra"
    E eu clico em "Confirmar"
    Então devo ver a refeição marcada como "Realizada"
    E devo ver um indicador de progresso atualizado do meu plano alimentar