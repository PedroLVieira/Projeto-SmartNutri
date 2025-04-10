import React, { useState } from "react";
import "../styles/planoalimentar.css";

export function PlanoAlimentar() {
  const [diaSelecionado, setDiaSelecionado] = useState("Segunda");

  const diasDaSemana = ["Segunda", "Terca"];

  const planoPorDia = {
    Segunda: [
      {
        refeicao: "Café da manhã",
        recomendado: "Iogurte com granola",
        substituicoes: "Vitamina de banana, Torradas integrais",
      },
      {
        refeicao: "Lanche da manhã",
        recomendado: "Fruta com castanhas",
        substituicoes: "Barra de cereal, Suco natural",
      },
      {
        refeicao: "Almoço",
        recomendado: "Arroz integral, frango grelhado e salada",
        substituicoes: "Quinoa, carne magra, legumes cozidos",
      },
      {
        refeicao: "Lanche da tarde",
        recomendado: "Sanduíche de pão integral com queijo branco",
        substituicoes: "Iogurte proteico, frutas",
      },
      {
        refeicao: "Jantar",
        recomendado: "Sopa de legumes com frango desfiado",
        substituicoes: "Creme de abóbora, omelete de legumes",
      },
      {
        refeicao: "Ceia",
        recomendado: "Chá de camomila com biscoito sem glúten",
        substituicoes: "Mix de castanhas, leite morno",
      },
    ],
    Terca: [
      {
        refeicao: "Café da manhã",
        recomendado: "Pão integral com ovo",
        substituicoes: "Tapioca, Panqueca de aveia",
      },
      {
        refeicao: "Lanche da manhã",
        recomendado: "Suco verde",
        substituicoes: "Água de coco, Frutas cítricas",
      },
      {
        refeicao: "Almoço",
        recomendado: "Feijão preto, arroz integral e carne magra",
        substituicoes: "Lentilha, batata doce e ovo cozido",
      },
      {
        refeicao: "Lanche da tarde",
        recomendado: "Iogurte natural com frutas vermelhas",
        substituicoes: "Smoothie de frutas, barra de proteína",
      },
      {
        refeicao: "Jantar",
        recomendado: "Quiche de legumes com salada verde",
        substituicoes: "Wrap integral, sopa de lentilha",
      },
      {
        refeicao: "Ceia",
        recomendado: "Leite com canela",
        substituicoes: "Banana amassada com aveia, chá de ervas",
      },
    ],
  };

  return (
    <div className="plano-container">
      <h2>🍽️ Plano Alimentar</h2>

      <div className="abas">
        {diasDaSemana.map((dia) => (
          <button
            key={dia}
            onClick={() => setDiaSelecionado(dia)}
            className={diaSelecionado === dia ? "aba ativa" : "aba"}
          >
            {dia}
          </button>
        ))}
      </div>

      <div className="refeicoes">
        {planoPorDia[diaSelecionado].map((item, index) => (
          <div key={index} className="refeicao-card">
            <h3>{item.refeicao}</h3>
            <p><strong>Recomendado:</strong> {item.recomendado}</p>
            <p><strong>Substituições:</strong> {item.substituicoes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
