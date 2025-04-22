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

  // Buscar clientes do nutricionista
  useEffect(() => {
    setCarregando(true);
    
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
    
    // Buscar clientes do nutricionista
    axios.get("http://localhost:8000/api/clientes/", getHeaders())
      .then(response => {
        setClientes(response.data.filter(user => user.tipo === 'cliente'));
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao buscar clientes:", error);
        setErro("Falha ao carregar lista de clientes.");
        setCarregando(false);
      });
  }, []);

  // Buscar planos quando o cliente é selecionado
  useEffect(() => {
    if (clienteSelecionado) {
      setCarregando(true);
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
  };

  const handleDiaChange = (e) => {
    setDiaSelecionado(Number(e.target.value));
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
    const planoData = {
      nome: novoPlano.nome,
      cliente: clienteSelecionado,
      nutricionista: localStorage.getItem("userId"),
      ativo: true
    };

    axios.post("http://localhost:8000/api/planoalimentar/planos/", planoData, getHeaders())
      .then(response => {
        setPlanos([...planos, response.data]);
        setPlanoSelecionado(response.data.id);
        setNovoPlano({ nome: "", cliente: "" });
        setModoEdicao(false);
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao criar plano:", error);
        setErro("Falha ao criar o plano alimentar.");
        setCarregando(false);
      });
  };

  const adicionarRefeicao = () => {
    if (!novaRefeicao.recomendado || !planoSelecionado || !diaSelecionado) {
      setErro("Preencha todos os campos para adicionar uma refeição.");
      return;
    }

    setCarregando(true);
    const refeicaoData = {
      plano_alimentar: planoSelecionado,
      dia_semana: diaSelecionado,
      nome: novaRefeicao.nome,
      recomendado: novaRefeicao.recomendado,
      substituicoes: novaRefeicao.substituicoes || "Sem substituições"
    };

    axios.post("http://localhost:8000/api/planoalimentar/refeicoes/criar_com_item/", refeicaoData, getHeaders())
      .then(response => {
        // Buscar refeições novamente para atualizar a lista
        const nomeDiaSemana = diasDaSemana.find(d => d.id === diaSelecionado)?.nome;
        const novaRefeicaoFormatada = {
          id: response.data.id,
          refeicao: tiposRefeicao.find(t => t.valor === novaRefeicao.nome)?.label,
          recomendado: novaRefeicao.recomendado,
          substituicoes: novaRefeicao.substituicoes || "Sem substituições"
        };

        // Adicionar a nova refeição à lista existente
        if (nomeDiaSemana) {
          setRefeicoes([...refeicoes, novaRefeicaoFormatada]);
        }

        setNovaRefeicao({
          nome: "cafe_da_manha",
          recomendado: "",
          substituicoes: ""
        });
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao adicionar refeição:", error);
        setErro("Falha ao adicionar a refeição.");
        setCarregando(false);
      });
  };

  const handleVoltar = () => {
    navigate("/dashboard-nutricionista");
  };

  if (carregando && !refeicoes.length && !clientes.length) {
    return (
      <div className="plano-container">
        <h2>Gerenciar Planos Alimentares</h2>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="plano-container">
      <h2>Gerenciar Planos Alimentares</h2>
      
      {erro && <p className="erro-message">{erro}</p>}
      
      <div className="gerenciar-section">
        <h3>Selecionar Cliente</h3>
        <select 
          value={clienteSelecionado} 
          onChange={handleClienteChange}
          className="form-select"
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
              >
                <option value="">Selecione um plano</option>
                {planos.map(plano => (
                  <option key={plano.id} value={plano.id}>{plano.nome}</option>
                ))}
              </select>
              <button 
                className="btn-outline"
                onClick={() => setModoEdicao(true)}
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
          
          {refeicoes.length > 0 ? (
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
        <button className="btn-outline" onClick={handleVoltar}>
          Voltar para Dashboard
        </button>
      </div>
    </div>
  );
}