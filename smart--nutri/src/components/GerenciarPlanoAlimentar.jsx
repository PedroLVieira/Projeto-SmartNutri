import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/gerenciar-plano-alimentar.css";
import "../styles/add-button-styles.css"; // Importando estilos adicionais
import NavBar from "./NavBar"; // Importando o componente NavBar

export function GerenciarPlanoAlimentar() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [diasDaSemana, setDiasDaSemana] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [refeicoes, setRefeicoes] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");
  const [filtroRefeicao, setFiltroRefeicao] = useState("");
  const [refeicaoEmEdicao, setRefeicaoEmEdicao] = useState(null);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(null);
  const [novaRefeicao, setNovaRefeicao] = useState({
    nome: "cafe_da_manha",
    recomendado: "",
    substituicoes: ""
  });
  const [novoPlano, setNovoPlano] = useState({
    nome: "",
    cliente: ""
  });

  const tiposRefeicao = [
    { valor: "cafe_da_manha", label: "Café da manhã" },
    { valor: "lanche_manha", label: "Lanche da manhã" },
    { valor: "almoco", label: "Almoço" },
    { valor: "lanche_tarde", label: "Lanche da tarde" },
    { valor: "jantar", label: "Jantar" },
    { valor: "ceia", label: "Ceia" }
  ];

  // Configuração do axios com token de autenticação
  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };
  
  // Reset de mensagens
  const resetMensagens = () => {
    setErro("");
    setSucessoMsg("");
  };

  // Função para exibir temporariamente mensagens de sucesso e remover automaticamente
  const mostrarMensagemSucesso = (mensagem) => {
    setSucessoMsg(mensagem);
    setTimeout(() => {
      setSucessoMsg("");
    }, 5000); // Remove a mensagem após 5 segundos
  };

  // Buscar dias da semana e clientes do nutricionista
  useEffect(() => {
    setCarregando(true);
    resetMensagens();
    
    // Buscar dias da semana
    axios.get("http://localhost:8000/api/planoalimentar/dias-semana/", getHeaders())
      .then(response => {
        setDiasDaSemana(response.data);
        if (response.data.length > 0) {
          setDiaSelecionado(response.data[0].id);
        }
      })
      .catch(error => {
        console.error("Erro ao buscar dias da semana:", error);
        setErro("Falha ao carregar dias da semana.");
      });
    
    // Buscar clientes do nutricionista (usando a nova rota)
    axios.get("http://localhost:8000/api/users/listar-clientes/", getHeaders())
      .then(response => {
        console.log("Clientes recebidos:", response.data);
        setClientes(response.data);
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao buscar clientes:", error);
        console.error("Detalhes do erro:", error.response?.data || "Sem detalhes");
        setErro("Falha ao carregar lista de clientes.");
        setCarregando(false);
      });
  }, []);

  // Buscar planos quando o cliente é selecionado
  useEffect(() => {
    if (clienteSelecionado) {
      setCarregando(true);
      resetMensagens();
      
      axios.get(`http://localhost:8000/api/planoalimentar/planos/planos_por_cliente/?cliente_id=${clienteSelecionado}`, getHeaders())
        .then(response => {
          setPlanos(response.data);
          if (response.data.length > 0) {
            setPlanoSelecionado(response.data[0].id);
          } else {
            setPlanoSelecionado("");
          }
          setCarregando(false);
        })
        .catch(error => {
          console.error("Erro ao buscar planos do cliente:", error);
          setErro("Falha ao carregar planos alimentares.");
          setCarregando(false);
        });
    }
  }, [clienteSelecionado]);

  // Função para carregar refeições
  const carregarRefeicoes = useCallback(() => {
    if (planoSelecionado && diaSelecionado) {
      setCarregando(true);
      resetMensagens();      axios.get(`http://localhost:8000/api/planoalimentar/planos/${planoSelecionado}/por_dia_semana/`, getHeaders())
        .then(response => {
          const diaAtual = diasDaSemana.find(d => d.id === diaSelecionado)?.nome;
          if (diaAtual && response.data[diaAtual]) {
            setRefeicoes(response.data[diaAtual]);
          } else {
            setRefeicoes([]);
          }
          setCarregando(false);
        })
        .catch(error => {
          console.error("Erro ao buscar refeições:", error);
          setErro("Falha ao carregar refeições.");
          setCarregando(false);
        });
    }
  }, [planoSelecionado, diaSelecionado, diasDaSemana]);

  // Buscar refeições quando um plano e dia são selecionados
  useEffect(() => {
    carregarRefeicoes();
  }, [planoSelecionado, diaSelecionado, carregarRefeicoes]);

  const handleClienteChange = (e) => {
    setClienteSelecionado(e.target.value);
  };

  const handlePlanoChange = (e) => {
    setPlanoSelecionado(e.target.value);
    resetMensagens();
  };

  const handleDiaChange = (e) => {
    setDiaSelecionado(Number(e.target.value));
    resetMensagens();
  };

  const handleNovaRefeicaoChange = (e) => {
    const { name, value } = e.target;
    setNovaRefeicao({ ...novaRefeicao, [name]: value });
  };

  const handleNovoPlanoChange = (e) => {
    const { name, value } = e.target;
    setNovoPlano({ ...novoPlano, [name]: value });
  };

  const criarNovoPlano = () => {
    if (!novoPlano.nome || !clienteSelecionado) {
      setErro("Preencha todos os campos para criar um plano alimentar.");
      return;
    }

    setCarregando(true);
    resetMensagens();
    
    // Obter o ID do nutricionista e garantir que é um número
    const nutricionistaId = parseInt(localStorage.getItem("userId"), 10);
    
    if (isNaN(nutricionistaId)) {
      console.error("ID do nutricionista inválido:", localStorage.getItem("userId"));
      setErro("ID do nutricionista inválido. Tente fazer login novamente.");
      setCarregando(false);
      return;
    }
    
    const planoData = {
      nome: novoPlano.nome,
      cliente: parseInt(clienteSelecionado, 10),
      nutricionista: nutricionistaId,
      ativo: true
    };
    
    console.log("Enviando dados para criação do plano:", planoData);

    axios.post("http://localhost:8000/api/planoalimentar/planos/", planoData, getHeaders())
      .then(response => {
        console.log("Resposta da criação do plano:", response.data);
        setPlanos([...planos, response.data]);
        setPlanoSelecionado(response.data.id);
        setNovoPlano({ nome: "", cliente: "" });
        setModoEdicao(false);
        mostrarMensagemSucesso("Plano alimentar criado com sucesso!");
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao criar plano:", error);
        console.error("Dados da resposta de erro:", error.response?.data);
        setErro(error.response?.data?.detail || "Falha ao criar o plano alimentar.");
        setCarregando(false);
      });
  };
  const adicionarRefeicao = () => {
    if (!planoSelecionado || !diaSelecionado || !novaRefeicao.nome || !novaRefeicao.recomendado) {
      setErro("Preencha todos os campos obrigatórios para adicionar uma refeição.");
      return;
    }

    setCarregando(true);
    resetMensagens();
    
    const diaAtual = diasDaSemana.find(d => d.id === diaSelecionado)?.nome;
    
    if (!diaAtual) {
      setErro("Dia da semana inválido.");
      setCarregando(false);
      return;
    }
    
    const refeicaoData = {
      plano_alimentar: parseInt(planoSelecionado, 10),
      dia_semana: diaSelecionado,
      nome: novaRefeicao.nome,
      recomendado: novaRefeicao.recomendado,
      substituicoes: novaRefeicao.substituicoes || ""
    };
    
    console.log("Enviando dados para criação de refeição:", refeicaoData);

    axios.post("http://localhost:8000/api/planoalimentar/refeicoes/criar_com_item/", refeicaoData, getHeaders())
      .then(response => {
        console.log("Resposta da criação de refeição:", response.data);
        
        // Atualizar a lista de refeições
        setRefeicoes([...refeicoes, response.data]);
        
        // Resetar o formulário
        setNovaRefeicao({
          nome: "cafe_da_manha",
          recomendado: "",
          substituicoes: ""
        });
        
        mostrarMensagemSucesso("Refeição adicionada com sucesso!");
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao adicionar refeição:", error);
        console.error("Dados da resposta de erro:", error.response?.data);
        setErro(error.response?.data?.detail || "Falha ao adicionar a refeição.");
        setCarregando(false);
      });
  };  // Iniciar edição de uma refeição
  const iniciarEdicaoRefeicao = (refeicao) => {
    console.log("Iniciando edição da refeição:", refeicao);
    
    // Verificar se a refeição tem todos os dados necessários
    if (!refeicao.id || !refeicao.nome) {
      console.error("Dados de refeição incompletos:", refeicao);
      setErro("Não foi possível editar esta refeição. Tente recarregar a página.");
      return;
    }
    
    setRefeicaoEmEdicao({
      id: refeicao.id,
      nome: refeicao.nome,
      recomendado: refeicao.recomendado,
      substituicoes: refeicao.substituicoes || ""
    });
  };

  // Cancelar edição de refeição
  const cancelarEdicaoRefeicao = () => {
    setRefeicaoEmEdicao(null);
  };  // Salvar edição de uma refeição
  const salvarEdicaoRefeicao = () => {
    if (!refeicaoEmEdicao || !refeicaoEmEdicao.recomendado) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setCarregando(true);
    resetMensagens();
    
    // Estruturar os dados conforme esperado pela API
    const refeicaoData = {
      dia_semana_id: diaSelecionado,
      itens: [{
        recomendado: refeicaoEmEdicao.recomendado,
        substituicoes: refeicaoEmEdicao.substituicoes || ""
      }]
    };
    
    console.log("Enviando dados para atualização:", refeicaoData);
    
    // Fazer a requisição para a API
    const url = `http://localhost:8000/api/planoalimentar/refeicoes/${refeicaoEmEdicao.id}/`;
    console.log("URL da requisição:", url);
    
    axios.put(url, refeicaoData, getHeaders())
      .then(response => {
        console.log("Resposta da atualização:", response.data);
        mostrarMensagemSucesso("Refeição atualizada com sucesso!");
        
        // Resetar o estado de edição
        setRefeicaoEmEdicao(null);
        
        // Recarregar as refeições para atualizar a interface
        carregarRefeicoes();
      })
      .catch(error => {
        console.error("Erro ao editar refeição:", error);
        console.error("Detalhes do erro:", error.response?.data);
        const mensagemErro = error.response?.data?.detail || 
                            "Falha ao atualizar a refeição. Tente novamente.";
        setErro(mensagemErro);
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  // Confirmar exclusão de uma refeição
  const confirmarExclusao = (refeicaoId) => {
    setConfirmacaoExclusao(refeicaoId);
  };

  // Cancelar exclusão
  const cancelarExclusao = () => {
    setConfirmacaoExclusao(null);
  };

  // Excluir uma refeição
  const excluirRefeicao = (refeicaoId) => {
    setCarregando(true);
    resetMensagens();
    
    axios.delete(`http://localhost:8000/api/planoalimentar/refeicoes/${refeicaoId}/`, getHeaders())
      .then(() => {
        // Atualizar a lista de refeições
        setRefeicoes(refeicoes.filter(r => r.id !== refeicaoId));
        setConfirmacaoExclusao(null);
        mostrarMensagemSucesso("Refeição removida com sucesso!");
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao excluir refeição:", error);
        setErro(error.response?.data?.detail || "Falha ao excluir a refeição.");
        setCarregando(false);
      });
  };

  // Manipulador de mudança para campos de edição
  const handleEdicaoChange = (e) => {
    const { name, value } = e.target;
    setRefeicaoEmEdicao({
      ...refeicaoEmEdicao,
      [name]: value
    });
  };
  // Função para filtrar as refeições
  const refeicoesFiltradas = refeicoes.filter(refeicao => {
    if (!filtroRefeicao) return true;
    return refeicao.nome === filtroRefeicao;
  });

  // Função para formatar o nome da refeição
  const formatarNomeRefeicao = (nome) => {
    const refeicao = tiposRefeicao.find(r => r.valor === nome);
    return refeicao ? refeicao.label : nome;
  };

  // Copiar plano para outro dia
  const copiarParaOutroDia = () => {
    // Implementação futura
    mostrarMensagemSucesso("Funcionalidade de cópia será implementada em breve!");
  };

  // Função para compartilhar plano via WhatsApp
  const compartilharViaWhatsApp = () => {
    if (!planoSelecionado || !clienteSelecionado || refeicoes.length === 0) {
      setErro("Selecione um cliente, um plano e certifique-se de que há refeições para compartilhar");
      return;
    }

    const clienteNome = clientes.find(c => c.id === parseInt(clienteSelecionado))?.nome || "Cliente";
    const planoNome = planos.find(p => p.id === parseInt(planoSelecionado))?.nome || "Plano Alimentar";
    const diaNome = diasDaSemana.find(d => d.id === diaSelecionado)?.nome || "Dia";
    
    let mensagem = `*Plano Alimentar: ${planoNome}*\n*Cliente: ${clienteNome}*\n*Dia: ${diaNome}*\n\n`;
    
    // Organizar refeições por tipo para uma apresentação mais clara
    const tiposOrdenados = tiposRefeicao.map(t => t.valor);
    const refeicoesOrdenadas = [...refeicoes].sort((a, b) => 
      tiposOrdenados.indexOf(a.nome) - tiposOrdenados.indexOf(b.nome)
    );
    
    refeicoesOrdenadas.forEach(refeicao => {
      const tipoRefeicaoLabel = tiposRefeicao.find(t => t.valor === refeicao.nome)?.label || refeicao.nome;
      mensagem += `*${tipoRefeicaoLabel}*\n`;
      mensagem += `Recomendado: ${refeicao.recomendado}\n`;
      if (refeicao.substituicoes) {
        mensagem += `Substituições: ${refeicao.substituicoes}\n`;
      }
      mensagem += '\n';
    });
    
    // Adicionar rodapé com nome do nutricionista
    const nutricionistaNome = localStorage.getItem("userName") || "Seu Nutricionista";
    mensagem += `\n_Plano elaborado por ${nutricionistaNome} via SmartNutri_`;
    
    // Codificar a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${mensagemCodificada}`;
    
    // Abrir em nova janela
    window.open(whatsappUrl, '_blank');
    
    mostrarMensagemSucesso("Plano preparado para compartilhar via WhatsApp!");
  };
    return (
    <div className="page-wrapper">
      <NavBar activePage="planosAlimentares" />
      <div className="gerenciar-plano-container">
        <div className="gerenciar-plano-header">
          <h1>Gerenciar Plano Alimentar</h1>
          <p>Crie e gerencie planos alimentares personalizados para seus clientes</p>
        </div>
        
        {erro && (
          <div className="alert alert-error" role="alert">
            {erro}
          </div>
        )}
        
        {sucessoMsg && (
          <div className="alert alert-success" role="alert">
            {sucessoMsg}
          </div>
        )}

        {carregando ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando informações...</p>
          </div>
        ) : (
          <>
            <div className="gerenciar-card">
              <h3>Selecionar Cliente e Plano</h3>
              <div className="form-group">
                <label htmlFor="cliente">Cliente:</label>
                <select
                  id="cliente"
                  className="form-control"
                  value={clienteSelecionado}
                  onChange={handleClienteChange}
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} ({cliente.email})
                    </option>
                  ))}
                </select>
              </div>
              
              {clienteSelecionado && (
                <>
                  <div className="form-group">
                    <label htmlFor="plano">Plano Alimentar:</label>
                    <select
                      id="plano"
                      className="form-control"
                      value={planoSelecionado}
                      onChange={handlePlanoChange}
                    >
                      <option value="">Selecione um plano</option>
                      {planos.map((plano) => (
                        <option key={plano.id} value={plano.id}>
                          {plano.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setModoEdicao(!modoEdicao)}
                    >
                      {modoEdicao ? "Cancelar" : "Novo Plano"}
                    </button>
                    {planoSelecionado && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={compartilharViaWhatsApp}
                      >
                        Compartilhar via WhatsApp
                      </button>
                    )}
                  </div>
                </>
              )}
              
              {modoEdicao && (
                <div className="adicionar-refeicao">
                  <h4>Criar Novo Plano</h4>
                  <div className="form-group">
                    <label htmlFor="nomePlano">Nome do Plano:</label>
                    <input
                      type="text"
                      id="nomePlano"
                      name="nome"
                      className="form-control"
                      value={novoPlano.nome}
                      onChange={handleNovoPlanoChange}
                      placeholder="Ex: Plano de Emagrecimento"
                    />
                  </div>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={criarNovoPlano}
                    >
                      Criar Plano
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setModoEdicao(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {planoSelecionado && (
              <div className="gerenciar-card">
                <h3>Gerenciar Refeições</h3>
                <div className="form-group">
                  <label htmlFor="diaSemana">Dia da Semana:</label>
                  <select
                    id="diaSemana"
                    className="form-control"
                    value={diaSelecionado}
                    onChange={handleDiaChange}
                  >
                    {diasDaSemana.map((dia) => (
                      <option key={dia.id} value={dia.id}>
                        {dia.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="acoes-plano">
                  <div className="filtro-refeicao">
                    <label htmlFor="filtroRefeicao">Filtrar por tipo:</label>
                    <select
                      id="filtroRefeicao"
                      className="form-control form-control-sm"
                      value={filtroRefeicao}
                      onChange={(e) => setFiltroRefeicao(e.target.value)}
                    >
                      <option value="">Todas as refeições</option>
                      {tiposRefeicao.map((tipo) => (
                        <option key={tipo.valor} value={tipo.valor}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="acoes-botoes">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={copiarParaOutroDia}
                    >
                      Copiar para outro dia
                    </button>
                  </div>
                </div>
                
                <h4>Refeições para {diasDaSemana.find((d) => d.id === diaSelecionado)?.nome}</h4>
                
                {refeicoesFiltradas.length === 0 ? (
                  <div className="empty-state">
                    <p>Nenhuma refeição encontrada para este dia.</p>
                    <p>Use o formulário abaixo para adicionar uma nova refeição.</p>
                  </div>
                ) : (
                  <div className="refeicoes-grid">
                    {refeicoesFiltradas.map((refeicao) => (
                      <div key={refeicao.id} className="refeicao-card">
                        {confirmacaoExclusao === refeicao.id ? (
                          <div className="confirmacao-exclusao">
                            <p>Confirmar exclusão?</p>
                            <div className="btn-group compact">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => excluirRefeicao(refeicao.id)}
                              >
                                Sim, excluir
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={cancelarExclusao}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : refeicaoEmEdicao && refeicaoEmEdicao.id === refeicao.id ? (                          <div className="edicao-refeicao">
                            <h4>Editar {formatarNomeRefeicao(refeicao.nome)}</h4>
                            <div className="form-group compact">
                              <label htmlFor={`editarRecomendado-${refeicao.id}`}>Recomendado:</label>
                              <textarea
                                id={`editarRecomendado-${refeicao.id}`}
                                name="recomendado"
                                className="form-control textarea"
                                value={refeicaoEmEdicao.recomendado}
                                onChange={handleEdicaoChange}
                                placeholder="Ex: 2 ovos cozidos, 1 fatia de pão integral..."
                              />
                            </div>
                            <div className="form-group compact">
                              <label htmlFor={`editarSubstituicoes-${refeicao.id}`}>Substituições (opcional):</label>
                              <textarea
                                id={`editarSubstituicoes-${refeicao.id}`}
                                name="substituicoes"
                                className="form-control textarea"
                                value={refeicaoEmEdicao.substituicoes}
                                onChange={handleEdicaoChange}
                                placeholder="Ex: Substituir ovos por 100g de frango..."
                              />
                            </div>
                            <div className="btn-group compact">                              <button
                                type="button"
                                className={`btn btn-primary btn-sm ${carregando ? 'salvando' : ''}`}
                                onClick={salvarEdicaoRefeicao}
                                disabled={carregando}
                              >
                                {carregando ? "Salvando..." : "Salvar"}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={cancelarEdicaoRefeicao}
                                disabled={carregando}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>                        ) : (
                          <>
                            <h4>{formatarNomeRefeicao(refeicao.nome)}</h4>
                            <p>
                              <strong>Recomendado:</strong><br />
                              {refeicao.recomendado}
                            </p>
                            {refeicao.substituicoes && (
                              <p>
                                <strong>Substituições:</strong><br />
                                {refeicao.substituicoes}
                              </p>
                            )}
                            <div className="btn-group compact">
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => iniciarEdicaoRefeicao(refeicao)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => confirmarExclusao(refeicao.id)}
                              >
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="adicionar-refeicao">
                  <h4>Adicionar Nova Refeição</h4>
                  <div className="form-group">
                    <label htmlFor="tipoRefeicao">Tipo de Refeição:</label>
                    <select
                      id="tipoRefeicao"
                      name="nome"
                      className="form-control"
                      value={novaRefeicao.nome}
                      onChange={handleNovaRefeicaoChange}
                    >
                      {tiposRefeicao.map((tipo) => (
                        <option key={tipo.valor} value={tipo.valor}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="recomendado">Recomendado:</label>
                    <textarea
                      id="recomendado"
                      name="recomendado"
                      className="form-control textarea"
                      value={novaRefeicao.recomendado}
                      onChange={handleNovaRefeicaoChange}
                      placeholder="Ex: 2 ovos cozidos, 1 fatia de pão integral..."
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="substituicoes">Substituições (opcional):</label>
                    <textarea
                      id="substituicoes"
                      name="substituicoes"
                      className="form-control textarea"
                      value={novaRefeicao.substituicoes}
                      onChange={handleNovaRefeicaoChange}
                      placeholder="Ex: Substituir ovos por 100g de frango..."
                    />
                  </div>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={adicionarRefeicao}
                    >
                      Adicionar Refeição
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}