import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/planoalimentar.css";

export function PlanoAlimentar() {
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [diasDaSemana, setDiasDaSemana] = useState([]);
  const [planoAlimentar, setPlanoAlimentar] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca os dados do plano alimentar da API
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setErro("É necessário estar logado para acessar o plano alimentar.");
      setCarregando(false);
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Busca os dias da semana disponíveis
    axios.get("http://localhost:8000/api/planoalimentar/dias-semana/", config)
      .then(response => {
        if (response.data && response.data.length > 0) {
          setDiasDaSemana(response.data.map(dia => dia.nome));
          setDiaSelecionado(response.data[0].nome);
        }
      })
      .catch(error => {
        console.error("Erro ao buscar dias da semana:", error);
      });
    
    // Busca o plano alimentar atual do cliente
    axios.get("http://localhost:8000/api/planoalimentar/planos/meu_plano_atual/", config)
      .then(response => {
        setPlanoAlimentar(response.data);
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao buscar plano alimentar:", error);
        setErro("Não foi possível carregar o plano alimentar.");
        setCarregando(false);
      });
  }, []);

  // Fallback para dados estáticos caso não tenha plano alimentar
  const dadosPlanoFallback = {
    "Segunda": [
      {
        "refeicao": "Café da manhã",
        "recomendado": "Iogurte com granola",
        "substituicoes": "Vitamina de banana, Torradas integrais",
      },
      {
        "refeicao": "Lanche da manhã",
        "recomendado": "Fruta com castanhas",
        "substituicoes": "Barra de cereal, Suco natural",
      },
      // ...outros itens omitidos
    ],
    "Terca": [
      // ...itens omitidos
    ]
  };

  if (carregando) {
    return (
      <div className="plano-container">
        <h2>🍽️ Plano Alimentar</h2>
        <p>Carregando seu plano alimentar...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="plano-container">
        <h2>🍽️ Plano Alimentar</h2>
        <p className="erro-message">{erro}</p>
        <p>Solicite ao seu nutricionista a criação de um plano alimentar.</p>
      </div>
    );
  }

  // Usa os dados da API ou o fallback se não houver dados
  const planoPorDia = Object.keys(planoAlimentar).length > 0 ? planoAlimentar : dadosPlanoFallback;

  return (
    <div className="plano-container">
      <h2>🍽️ Plano Alimentar</h2>

      <div className="abas">
        {diasDaSemana.filter(dia => planoPorDia[dia] && planoPorDia[dia].length > 0).map((dia) => (
          <button
            key={dia}
            onClick={() => setDiaSelecionado(dia)}
            className={diaSelecionado === dia ? "aba ativa" : "aba"}
          >
            {dia}
          </button>
        ))}
      </div>

      {diaSelecionado && planoPorDia[diaSelecionado] ? (
        <div className="refeicoes">
          {planoPorDia[diaSelecionado].map((item, index) => (
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
    </div>
  );
}
