import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/planoalimentar.css";

export function GerenciarPlanoAlimentar() {
  const navigate = useNavigate();
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

  // Buscar refeições quando um plano e dia são selecionados
  useEffect(() => {
    if (planoSelecionado && diaSelecionado) {
      setCarregando(true);
      resetMensagens();
      
      axios.get(`http://localhost:8000/api/planoalimentar/planos/${planoSelecionado}/por_dia_semana/`, getHeaders())
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
        setSucessoMsg("Plano alimentar criado com sucesso!");
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
    if (!novaRefeicao.recomendado || !planoSelecionado || !diaSelecionado) {
      setErro("Preencha todos os campos para adicionar uma refeição.");
      return;
    }

    setCarregando(true);
    resetMensagens();
    
    const refeicaoData = {
      plano_alimentar: planoSelecionado,
      dia_semana: diaSelecionado,
      nome: novaRefeicao.nome,
      recomendado: novaRefeicao.recomendado,
      substituicoes: novaRefeicao.substituicoes || "Sem substituições"
    };

    axios.post("http://localhost:8000/api/planoalimentar/refeicoes/criar_com_item/", refeicaoData, getHeaders())
      .then(response => {
        // Formatar a nova refeição para corresponder ao formato exibido
        const novaRefeicaoFormatada = {
          id: response.data.id,
          refeicao: tiposRefeicao.find(t => t.valor === novaRefeicao.nome)?.label,
          recomendado: novaRefeicao.recomendado,
          substituicoes: novaRefeicao.substituicoes || "Sem substituições"
        };

        // Adicionar à lista atual
        setRefeicoes([...refeicoes, novaRefeicaoFormatada]);
        
        // Limpar o formulário
        setNovaRefeicao({
          nome: "cafe_da_manha",
          recomendado: "",
          substituicoes: ""
        });
        
        setSucessoMsg("Refeição adicionada com sucesso!");
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao adicionar refeição:", error);
        setErro(error.response?.data?.detail || "Falha ao adicionar a refeição.");
        setCarregando(false);
      });
  };

  const handleVoltar = () => {
    navigate("/dashboard-nutricionista");
  };

  return (
    <div className="plano-container">
      <h2>Gerenciar Planos Alimentares</h2>
      
      {erro && <p className="erro-message">{erro}</p>}
      {sucessoMsg && <p className="sucesso-message">{sucessoMsg}</p>}
      
      <div className="gerenciar-section">
        <h3>Selecionar Cliente</h3>
        <select 
          value={clienteSelecionado} 
          onChange={handleClienteChange}
          className="form-select"
          disabled={carregando}
        >
          <option value="">Selecione um cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>{cliente.username}</option>
          ))}
        </select>
      </div>

      {clienteSelecionado && (
        <div className="gerenciar-section">
          <h3>Plano Alimentar</h3>
          
          {!modoEdicao ? (
            <div>
              <select 
                value={planoSelecionado} 
                onChange={handlePlanoChange}
                className="form-select"
                disabled={carregando}
              >
                <option value="">Selecione um plano</option>
                {planos.map(plano => (
                  <option key={plano.id} value={plano.id}>{plano.nome}</option>
                ))}
              </select>
              <button 
                className="btn-outline"
                onClick={() => setModoEdicao(true)}
                disabled={carregando}
              >
                Criar Novo Plano
              </button>
            </div>
          ) : (
            <div className="form-group">
              <input 
                type="text"
                name="nome"
                placeholder="Nome do plano alimentar"
                value={novoPlano.nome}
                onChange={handleNovoPlanoChange}
                className="form-input"
                disabled={carregando}
              />
              <div className="form-buttons">
                <button 
                  className="btn-submit" 
                  onClick={criarNovoPlano}
                  disabled={carregando}
                >
                  {carregando ? "Criando..." : "Criar Plano"}
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setModoEdicao(false)}
                  disabled={carregando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {planoSelecionado && (
        <div className="gerenciar-section">
          <h3>Selecionar Dia da Semana</h3>
          <select 
            value={diaSelecionado} 
            onChange={handleDiaChange}
            className="form-select"
            disabled={carregando}
          >
            <option value="">Selecione um dia</option>
            {diasDaSemana.map(dia => (
              <option key={dia.id} value={dia.id}>{dia.nome}</option>
            ))}
          </select>
        </div>
      )}

      {planoSelecionado && diaSelecionado && (
        <div className="gerenciar-section">
          <h3>Refeições do Dia</h3>
          
          {carregando ? (
            <p>Carregando refeições...</p>
          ) : refeicoes.length > 0 ? (
            <div className="refeicoes">
              {refeicoes.map((item, index) => (
                <div key={index} className="refeicao-card">
                  <h3>{item.refeicao}</h3>
                  <p><strong>Recomendado:</strong> {item.recomendado}</p>
                  <p><strong>Substituições:</strong> {item.substituicoes}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhuma refeição cadastrada para este dia.</p>
          )}

          <div className="adicionar-refeicao">
            <h3>Adicionar Nova Refeição</h3>
            <div className="form-group">
              <label>Tipo de Refeição</label>
              <select
                name="nome"
                value={novaRefeicao.nome}
                onChange={handleNovaRefeicaoChange}
                className="form-select"
                disabled={carregando}
              >
                {tiposRefeicao.map(tipo => (
                  <option key={tipo.valor} value={tipo.valor}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Recomendação</label>
              <textarea
                name="recomendado"
                value={novaRefeicao.recomendado}
                onChange={handleNovaRefeicaoChange}
                placeholder="Descrição da alimentação recomendada"
                className="form-textarea"
                disabled={carregando}
              />
            </div>
            <div className="form-group">
              <label>Substituições (opcional)</label>
              <textarea
                name="substituicoes"
                value={novaRefeicao.substituicoes}
                onChange={handleNovaRefeicaoChange}
                placeholder="Opções de substituição"
                className="form-textarea"
                disabled={carregando}
              />
            </div>
            <button 
              className="btn-submit"
              onClick={adicionarRefeicao}
              disabled={carregando}
            >
              {carregando ? "Adicionando..." : "Adicionar Refeição"}
            </button>
          </div>
        </div>
      )}

      <div className="botoes-navegacao">
        <button className="btn-outline" onClick={handleVoltar} disabled={carregando}>
          Voltar para Dashboard
        </button>
      </div>
    </div>
  );
}