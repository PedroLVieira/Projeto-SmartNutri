import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "../styles/perfil.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaWeight, FaRulerVertical, FaCalendarAlt, FaMapMarkerAlt, FaVenusMars } from "react-icons/fa";

export function Perfil() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    nome: "",
    email: "",
    tipo: "",
    telefone: "",
    sexo: "",
    idade: "",
    cpf: "",
    peso: "",
    altura: "",
    endereco: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      
      try {
        const userType = localStorage.getItem("userType");
        const userId = localStorage.getItem("userId");
        
        if (!userType || !userId) {
          navigate("/login");
          return;
        }

        // Buscar perfil do usuário autenticado
        const response = await axios.get("/api/users/perfil/");
        if (response.data) {
          setUserInfo({
            nome: response.data.nome || response.data.user?.first_name || "",
            email: response.data.email || "",
            tipo: response.data.tipo || userType,
            telefone: response.data.telefone || "",
            sexo: response.data.sexo || "",
            idade: response.data.idade || "",
            cpf: response.data.cpf || "",
            peso: response.data.peso || "",
            altura: response.data.altura || "",
            endereco: response.data.endereco || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        setError("Não foi possível carregar seus dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="profile-layout">
      <NavBar userType={localStorage.getItem("userType") || "cliente"} />
      
      <div className="profile-content">
        <div className="profile-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>
        
        {loading ? (
          <div className="loading-indicator">Carregando informações...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                <FaUser />
              </div>
              <h2>{userInfo.nome}</h2>
              <span className="profile-type">{userInfo.tipo === "nutricionista" ? "Nutricionista" : "Cliente"}</span>
            </div>
            
            <div className="profile-details">
              <div className="details-section">
                <h3>Informações Pessoais</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-icon"><FaEnvelope /></div>
                    <div className="detail-content">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{userInfo.email}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon"><FaPhone /></div>
                    <div className="detail-content">
                      <span className="detail-label">Telefone</span>
                      <span className="detail-value">{userInfo.telefone || "Não informado"}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon"><FaIdCard /></div>
                    <div className="detail-content">
                      <span className="detail-label">CPF</span>
                      <span className="detail-value">{userInfo.cpf || "Não informado"}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon"><FaVenusMars /></div>
                    <div className="detail-content">
                      <span className="detail-label">Sexo</span>
                      <span className="detail-value">{userInfo.sexo || "Não informado"}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon"><FaCalendarAlt /></div>
                    <div className="detail-content">
                      <span className="detail-label">Idade/Data Nascimento</span>
                      <span className="detail-value">{userInfo.idade || "Não informado"}</span>
                    </div>
                  </div>
                  
                  {userInfo.tipo === "cliente" && (
                    <>
                      <div className="detail-item">
                        <div className="detail-icon"><FaWeight /></div>
                        <div className="detail-content">
                          <span className="detail-label">Peso</span>
                          <span className="detail-value">{userInfo.peso ? `${userInfo.peso} kg` : "Não informado"}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon"><FaRulerVertical /></div>
                        <div className="detail-content">
                          <span className="detail-label">Altura</span>
                          <span className="detail-value">{userInfo.altura ? `${userInfo.altura} cm` : "Não informado"}</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="detail-item full-width">
                    <div className="detail-icon"><FaMapMarkerAlt /></div>
                    <div className="detail-content">
                      <span className="detail-label">Endereço</span>
                      <span className="detail-value">{userInfo.endereco || "Não informado"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="btn btn-outline" onClick={() => navigate("/editar-perfil")}>
                  Editar Perfil
                </button>
                <button className="btn btn-outline" onClick={() => navigate("/alterar-senha")}>
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
