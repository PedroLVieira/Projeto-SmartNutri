import React from "react";
import "../styles/dashboard-cliente.css"; // novo css separado
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaClipboardList, FaUser, FaSignOutAlt } from "react-icons/fa";

export function DashboardCliente() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="cliente-dashboard-container">
      {/* Botão sair no topo */}
      <button className="logout-button-top" onClick={handleLogout} title="Sair">
        <FaSignOutAlt />
      </button>

      <header className="cliente-dashboard-header">
        <h2>Olá, Cliente!</h2>
        <p>Você está logado como <strong>Cliente</strong>.</p>
      </header>

      <main className="cliente-dashboard-main">
        <div className="cliente-dashboard-card" onClick={() => navigate("/plano-alimentar")}>
          <FaUtensils className="cliente-icon" />
          <span>Plano Alimentar</span>
        </div>
        <div className="cliente-dashboard-card" onClick={() => alert("Ver relatórios")}>
          <FaClipboardList className="cliente-icon" />
          <span>Relatórios</span>
        </div>
        <div className="cliente-dashboard-card" onClick={() => navigate("/perfil")}>
          <FaUser className="cliente-icon" />
          <span>Perfil</span>
        </div>
      </main>
    </div>
  );
}
