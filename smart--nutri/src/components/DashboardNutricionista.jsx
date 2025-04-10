import React from "react";
import "../styles/dashboard-nutricionista.css";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaUserMd, FaSignOutAlt } from "react-icons/fa";

export function DashboardNutricionista() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="nutri-dashboard-container">
      {/* Botão de logout no canto superior direito */}
      <button className="logout-button-top" onClick={handleLogout} title="Sair">
        <FaSignOutAlt />
      </button>

      <header className="nutri-dashboard-header">
        <h2>Olá, Nutricionista!</h2>
        <p>Você está logado como <strong>Nutricionista</strong>.</p>
      </header>

      <main className="nutri-dashboard-main">
        <div className="nutri-dashboard-card" onClick={() => navigate("/paciente-perfil")}>
          <FaUserMd className="nutri-icon" />
          <span>Pacientes</span>
        </div>
        <div className="nutri-dashboard-card" onClick={() => alert("Relatórios gerais")}>
          <FaClipboardList className="nutri-icon" />
          <span>Relatórios</span>
        </div>
      </main>
    </div>
  );
}
