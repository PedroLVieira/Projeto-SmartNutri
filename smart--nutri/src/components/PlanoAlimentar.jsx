import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/planoalimentar.css";

export function PlanoAlimentar() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [planosDisponiveis, setPlanosDisponiveis] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [dadosPorDia, setDadosPorDia] = useState({});

  // Lista de dias da semana para exibição
  const diasDaSemana = [
    "Segunda", 
    "Terça", 
    "Quarta", 
    "Quinta", 
    "Sexta", 
    "Sábado", 
    "Domingo"
  ];

  // Configuração do axios com token de autenticação
  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  // Buscar planos alimentares disponíveis para o cliente
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setErro("É necessário estar logado para acessar o plano alimentar.");
      setCarregando(false);
      return;
    }

    // Buscar planos alimentares do cliente
    axios.get("http://localhost:8000/api/planoalimentar/planos/", getHeaders())
      .then(response => {
        console.log("Planos recebidos:", response.data);
        setPlanosDisponiveis(response.data);
        
        // Se houver pelo menos um plano, seleciona o primeiro por padrão
        if (response.data.length > 0) {
          setPlanoSelecionado(response.data[0]);
        } else {
          setErro("Nenhum plano alimentar encontrado.");
        }
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao buscar planos alimentares:", error);
        setErro("Não foi possível carregar seus planos alimentares.");
        setCarregando(false);
      });
  }, []);

  // Buscar detalhes do plano selecionado
  useEffect(() => {
    if (!planoSelecionado) return;

    setCarregando(true);
    axios.get(`http://localhost:8000/api/planoalimentar/planos/${planoSelecionado.id}/por_dia_semana/`, getHeaders())
      .then(response => {
        console.log("Detalhes do plano:", response.data);
        setDadosPorDia(response.data);
        
        // Seleciona o primeiro dia que tiver refeições
        const primeiroDiaComRefeicao = diasDaSemana.find(dia => response.data[dia] && response.data[dia].length > 0);
        setDiaSelecionado(primeiroDiaComRefeicao || diasDaSemana[0]);
        
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao buscar detalhes do plano:", error);
        setErro("Não foi possível carregar os detalhes do plano alimentar.");
        setCarregando(false);
      });
  }, [planoSelecionado]);

  // Função para trocar o plano selecionado
  const handleTrocaPlano = (e) => {
    const planoId = parseInt(e.target.value, 10);
    const plano = planosDisponiveis.find(p => p.id === planoId);
    setPlanoSelecionado(plano);
  };

  // Verifica se tem refeições no dia
  const temRefeicoes = (dia) => {
    return dadosPorDia[dia] && dadosPorDia[dia].length > 0;
  };

  // Estados de carregamento e erro
  if (carregando) {
    return (
      <div className="plano-container">
        <h2>🍽️ Plano Alimentar</h2>
        <p>Carregando seu plano alimentar...</p>
      </div>
    );
  }

  if (erro && !planoSelecionado) {
    return (
      <div className="plano-container">
        <h2>🍽️ Plano Alimentar</h2>
        <p className="erro-message">{erro}</p>
        <p>Solicite ao seu nutricionista a criação de um plano alimentar.</p>
      </div>
    );
  }

  return (
    <div className="plano-container">
      <h2>🍽️ Plano Alimentar</h2>
      
      {/* Seletor de planos */}
      {planosDisponiveis.length > 1 && (
        <div className="selector-container">
          <label htmlFor="plano-selector">Selecione seu plano:</label>
          <select 
            id="plano-selector" 
            className="plano-selector"
            value={planoSelecionado?.id || ''}
            onChange={handleTrocaPlano}
          >
            {planosDisponiveis.map(plano => (
              <option key={plano.id} value={plano.id}>
                {plano.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {planoSelecionado && (
        <>
          <h3 className="plano-nome">{planoSelecionado.nome}</h3>
          
          {/* Navegação dos dias da semana */}
          <div className="dias-semana-nav">
            {diasDaSemana.map(dia => (
              <button
                key={dia}
                className={`dia-btn ${diaSelecionado === dia ? 'ativo' : ''} ${!temRefeicoes(dia) ? 'vazio' : ''}`}
                onClick={() => setDiaSelecionado(dia)}
                disabled={!temRefeicoes(dia)}
              >
                {dia.substring(0, 3)}
              </button>
            ))}
          </div>

          {/* Conteúdo do dia selecionado */}
          <div className="dia-conteudo">
            <h3>{diaSelecionado}</h3>
            
            {temRefeicoes(diaSelecionado) ? (
              <div className="refeicoes">
                {dadosPorDia[diaSelecionado].map((item, index) => (
                  <div key={index} className="refeicao-card">
                    <h3>{item.refeicao}</h3>
                    <p><strong>Recomendado:</strong> {item.recomendado}</p>
                    <p><strong>Substituições:</strong> {item.substituicoes || "Nenhuma substituição sugerida"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sem-refeicoes">
                Não há refeições programadas para {diaSelecionado}.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
