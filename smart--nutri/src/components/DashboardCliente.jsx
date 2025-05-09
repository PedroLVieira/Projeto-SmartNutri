import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard-cliente.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { FaUtensils, FaUser, FaArrowRight, FaAppleAlt, FaCarrot } from "react-icons/fa";

export function DashboardCliente() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  
  useEffect(() => {
    // Recuperar nome do usuário do localStorage
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Mostrar animação de boas-vindas após pequeno delay
    setTimeout(() => {
      setShowWelcomeAnimation(true);
    }, 300);
  }, []);

  const handleCardHover = (index) => {
    setActiveCard(index);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  return (
    <div className="dashboard-layout">
      <NavBar userType="cliente" />
      
      <div className="dashboard-content">
        <div className={`dashboard-header ${showWelcomeAnimation ? 'show-animation' : ''}`}>
          <h1>Painel do Cliente</h1>
          <p>Bem-vindo(a), <strong>{userName || "Cliente"}</strong>!</p>
          <p className="subtitle">Gerencie seu plano alimentar e informações pessoais</p>
        </div>
        
        <div className="dashboard-section">
          <h2>Meu Acompanhamento</h2>
          <div className="cards-container">
            <div 
              className={`dashboard-card ${activeCard === 0 ? 'active-card' : ''}`}
              onClick={() => navigate("/plano-alimentar")}
              onMouseEnter={() => handleCardHover(0)}
              onMouseLeave={handleCardLeave}
            >
              <div className="card-icon">
                <FaUtensils />
              </div>
              <div className="card-info">
                <h3>Plano Alimentar</h3>
                <p>Visualize seu plano alimentar personalizado</p>
                <span className="card-link">
                  Ver plano <FaArrowRight className="arrow-icon" />
                </span>
              </div>
            </div>
            
            <div 
              className={`dashboard-card ${activeCard === 1 ? 'active-card' : ''}`}
              onClick={() => navigate("/perfil")}
              onMouseEnter={() => handleCardHover(1)}
              onMouseLeave={handleCardLeave}
            >
              <div className="card-icon">
                <FaUser />
              </div>
              <div className="card-info">
                <h3>Meu Perfil</h3>
                <p>Visualize e edite suas informações pessoais</p>
                <span className="card-link">
                  Ver perfil <FaArrowRight className="arrow-icon" />
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="welcome-banner">
          <div className="banner-content">
            <h2>Dicas para uma alimentação saudável</h2>
            <ul className="tips-list">
              <li className="tip-item">Mantenha-se hidratado bebendo pelo menos 2 litros de água por dia</li>
              <li className="tip-item">Inclua frutas e vegetais frescos em suas refeições</li>
              <li className="tip-item">Siga rigorosamente seu plano alimentar para melhores resultados</li>
              <li className="tip-item">Em caso de dúvidas, consulte sempre seu nutricionista</li>
            </ul>
          </div>
          <div className="banner-icons">
            <FaAppleAlt className="food-icon apple" />
            <FaCarrot className="food-icon carrot" />
          </div>
        </div>

        <div className="quick-access">
          <h3>Acesso Rápido</h3>
          <div className="quick-buttons">
            <button onClick={() => navigate("/plano-alimentar")} className="quick-button">
              <FaUtensils className="button-icon" />
              <span>Ver plano alimentar</span>
            </button>
            <button onClick={() => navigate("/perfil")} className="quick-button">
              <FaUser className="button-icon" />
              <span>Meu perfil</span>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
