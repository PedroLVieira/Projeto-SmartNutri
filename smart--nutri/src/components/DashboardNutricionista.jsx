import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard-nutricionista.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { FaUserMd, FaUtensils, FaClipboardList, FaUsers, FaBullseye, FaChartLine } from "react-icons/fa";
import axios from "../axios";

export function DashboardNutricionista() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    count: {
      patients: 0,
      mealPlans: 0
    }
  });
  
  useEffect(() => {
    // Recuperar informações do usuário do localStorage
    const userName = localStorage.getItem("userName");
    if (userName) {
      setUserInfo(prev => ({ ...prev, name: userName }));
    }
    
    // Aqui você poderia buscar dados do backend para estatísticas
    const fetchDashboardData = async () => {
      try {
        // Exemplo de fetch para dados do dashboard
        // const response = await axios.get("http://localhost:8000/api/nutricionista/dashboard/", {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        // });
        // setUserInfo(prev => ({ ...prev, count: response.data.count }));
        
        // Simulando dados para demonstração
        setUserInfo(prev => ({ 
          ...prev, 
          count: {
            patients: 12,
            mealPlans: 8
          }
        }));
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      <NavBar userType="nutricionista" />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Painel do Nutricionista</h1>
          <p>Bem-vindo(a), <strong>{userInfo.name || "Nutricionista"}</strong>!</p>
          <p className="subtitle">Gerencie seus pacientes e planos alimentares.</p>
        </div>
        
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>Pacientes</h3>
              <p className="stat-number">{userInfo.count.patients}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaUtensils />
            </div>
            <div className="stat-info">
              <h3>Planos Alimentares</h3>
              <p className="stat-number">{userInfo.count.mealPlans}</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Gerenciar</h2>
          <div className="cards-container">
            <div className="dashboard-card" onClick={() => navigate("/paciente-perfil")}>
              <div className="card-icon">
                <FaUserMd />
              </div>
              <div className="card-info">
                <h3>Pacientes</h3>
                <p>Visualize e gerencie seus pacientes</p>
              </div>
            </div>
            
            <div className="dashboard-card" onClick={() => navigate("/gerenciar-plano-alimentar")}>
              <div className="card-icon">
                <FaUtensils />
              </div>
              <div className="card-info">
                <h3>Planos Alimentares</h3>
                <p>Crie e edite planos alimentares</p>
              </div>
            </div>
            
            <div className="dashboard-card" onClick={() => navigate("/relatorios")}>
              <div className="card-icon">
                <FaClipboardList />
              </div>
              <div className="card-info">
                <h3>Relatórios</h3>
                <p>Visualize relatórios e estatísticas</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Desempenho</h2>
          <div className="cards-container">
            <div className="dashboard-card performance">
              <div className="card-icon">
                <FaChartLine />
              </div>
              <div className="card-info">
                <h3>Acompanhamento</h3>
                <p>Progresso dos pacientes nas últimas semanas</p>
                <div className="progress-chart">
                  <div className="chart-bar" style={{height: "60%"}}></div>
                  <div className="chart-bar" style={{height: "75%"}}></div>
                  <div className="chart-bar" style={{height: "45%"}}></div>
                  <div className="chart-bar" style={{height: "80%"}}></div>
                  <div className="chart-bar" style={{height: "65%"}}></div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card performance">
              <div className="card-icon">
                <FaBullseye />
              </div>
              <div className="card-info">
                <h3>Metas</h3>
                <p>Acompanhamento de metas alcançadas</p>
                <div className="goals-container">
                  <div className="goal-item">
                    <div className="goal-progress" style={{width: "75%"}}></div>
                    <span>Planos criados</span>
                  </div>
                  <div className="goal-item">
                    <div className="goal-progress" style={{width: "60%"}}></div>
                    <span>Consultas realizadas</span>
                  </div>
                  <div className="goal-item">
                    <div className="goal-progress" style={{width: "45%"}}></div>
                    <span>Objetivos atingidos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
