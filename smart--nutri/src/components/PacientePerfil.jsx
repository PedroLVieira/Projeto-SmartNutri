import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "../styles/pacienteperfil.css";

export function PacientePerfil() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [planoAlimentar, setPlanoAlimentar] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState("segunda"); // Default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Lógica para buscar os dados do paciente e plano alimentar
    // Exemplo:
    // axios.get(`/api/pacientes/${pacienteId}`)
    //   .then(response => {
    //     setPaciente(response.data);
    //     setPlanoAlimentar(response.data.planoAlimentar);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     setError("Erro ao carregar os dados do paciente.");
    //     setLoading(false);
    //   });
  }, [pacienteId]);

  if (loading) {
    return (
      <>
        <NavBar activePage="planosAlimentares" />
        <div>Carregando perfil do paciente...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar activePage="planosAlimentares" />
        <div>Erro: {error}</div>
      </>
    );
  }

  if (!paciente) {
    return (
      <>
        <NavBar activePage="planosAlimentares" />
        <div>Paciente não encontrado.</div>
      </>
    );
  }

  return (
    <div className="paciente-perfil-container">
      <NavBar activePage="planosAlimentares" />

      <header className="profile-header">
        <h1>{paciente.nome}</h1>
        <p>Plano Alimentar</p>
      </header>

      <div className="info-pessoal">
        <p>
          <strong>Idade:</strong> {paciente.idade} anos
        </p>
        <p>
          <strong>Peso:</strong> {paciente.peso}
        </p>
        <p>
          <strong>Altura:</strong> {paciente.altura}
        </p>
        <p>
          <strong>Objetivo:</strong> {paciente.objetivo}
        </p>
        <p>
          <strong>Restrições:</strong> {paciente.restricoes}
        </p>
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
            <p>
              <strong>Recomendado:</strong> {item.recomendado}
            </p>
            <p>
              <strong>Substituições:</strong> {item.substituicoes}
            </p>
          </div>
        ))}
      </div>

      <button className="voltar" onClick={() => navigate(-1)}>
        ← Voltar
      </button>
    </div>
  );
}
