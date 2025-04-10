import React from "react";
import "../styles/perfil.css";
import { useNavigate } from "react-router-dom";

export function Perfil() {
  const navigate = useNavigate();

  const userType = localStorage.getItem("userType") || "Cliente";
  const userName = localStorage.getItem("userName") || "Usuário";

  const dadosCliente = {
    idade: 21,
    peso: "60kg",
    altura: "1.65m",
    objetivo: "Emagrecimento",
    restricoes: "Sem glúten"
  };

  const dadosNutricionista = {
    crn: "12345-6",
    experiencia: "5 anos",
    especializacao: "Nutrição Esportiva",
    local: "São Paulo - SP"
  };

  const handleVoltar = () => {
    if (userType === "Cliente") {
      navigate("/dashboard-cliente");
    } else {
      navigate("/dashboard-nutricionista");
    }
  };

  return (
    <div className="perfil-container">
      <h2>Perfil de {userName}</h2>
      <p><strong>Tipo de usuário:</strong> {userType}</p>

      {userType === "Cliente" ? (
        <div className="perfil-dados">
          <p><strong>Idade:</strong> {dadosCliente.idade} anos</p>
          <p><strong>Peso:</strong> {dadosCliente.peso}</p>
          <p><strong>Altura:</strong> {dadosCliente.altura}</p>
          <p><strong>Objetivo:</strong> {dadosCliente.objetivo}</p>
          <p><strong>Restrições:</strong> {dadosCliente.restricoes}</p>
        </div>
      ) : (
        <div className="perfil-dados">
          <p><strong>CRN:</strong> {dadosNutricionista.crn}</p>
          <p><strong>Experiência:</strong> {dadosNutricionista.experiencia}</p>
          <p><strong>Especialização:</strong> {dadosNutricionista.especializacao}</p>
          <p><strong>Atuação:</strong> {dadosNutricionista.local}</p>
        </div>
      )}

      <div className="perfil-actions">
        <button className="btn-outline" onClick={handleVoltar}>Voltar</button>
        <button className="btn-outline" onClick={() => navigate("/")}>Sair</button>
      </div>
    </div>
  );
}
