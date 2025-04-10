import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pacienteperfil.css";

export function PacientePerfil() {
  const navigate = useNavigate();
  const [diaSelecionado, setDiaSelecionado] = useState("Segunda");

  const paciente = {
    nome: "João Silva",
    idade: 30,
    peso: "75kg",
    altura: "1.75m",
    objetivo: "Ganhar massa muscular",
    restricoes: "Lactose",
  };

  const planoAlimentar = {
    Segunda: [
      {
        refeicao: "Café da manhã",
        recomendado: "Ovos mexidos com pão integral",
        substituicoes: "Vitamina com aveia, Panqueca de banana",
      },
      {
        refeicao: "Jantar",
        recomendado: "Frango grelhado com legumes",
        substituicoes: "Tofu grelhado, Peixe assado",
      },
    ],
    Terça: [
      {
        refeicao: "Café da manhã",
        recomendado: "Vitamina de frutas com aveia",
        substituicoes: "Iogurte vegano com granola",
      },
      {
        refeicao: "Jantar",
        recomendado: "Carne magra com arroz integral e brócolis",
        substituicoes: "Quinoa com legumes",
      },
    ],
  };

  return (
    <div className="paciente-perfil-container">
      <h2>Perfil do Paciente: {paciente.nome}</h2>

      <div className="info-pessoal">
        <p><strong>Idade:</strong> {paciente.idade} anos</p>
        <p><strong>Peso:</strong> {paciente.peso}</p>
        <p><strong>Altura:</strong> {paciente.altura}</p>
        <p><strong>Objetivo:</strong> {paciente.objetivo}</p>
        <p><strong>Restrições:</strong> {paciente.restricoes}</p>
      </div>

      <div className="dias-abas">
        {Object.keys(planoAlimentar).map((dia) => (
          <button
            key={dia}
            className={diaSelecionado === dia ? "aba ativa" : "aba"}
            onClick={() => setDiaSelecionado(dia)}
          >
            {dia}
          </button>
        ))}
      </div>

      <div className="plano-refeicoes">
        {planoAlimentar[diaSelecionado].map((item, index) => (
          <div className="card-refeicao" key={index}>
            <h4>{item.refeicao}</h4>
            <p><strong>Recomendado:</strong> {item.recomendado}</p>
            <p><strong>Substituições:</strong> {item.substituicoes}</p>
          </div>
        ))}
      </div>

      <button className="voltar" onClick={() => navigate(-1)}>← Voltar</button>
    </div>
  );
}
