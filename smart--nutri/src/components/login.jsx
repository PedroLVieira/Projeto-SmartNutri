import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import axios from "../axios";
import "../styles/login.css";
import logo from "../assets/logo.svg";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/token/", {
        username: email, // pode ser email ou username
        password: password
      });

      if (response.data && response.data.access) {
        // Obter o tipo de usuário da resposta do servidor
        const userTipoFromServer = response.data.tipo;
        
        // Salvar dados no localStorage
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("userType", userTipoFromServer);
        localStorage.setItem("userName", response.data.name || "Usuário");
        localStorage.setItem("userId", response.data.user_id);
        localStorage.setItem("userEmail", response.data.email);
        
        console.log("Tipo de usuário detectado:", userTipoFromServer);
        
        // Redireciona automaticamente com base no tipo de usuário
        if (userTipoFromServer === "nutricionista") {
          navigate("/dashboard-nutricionista");
        } else {
          navigate("/dashboard-cliente");
        }
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response && err.response.status === 401) {
        setError("Credenciais inválidas. Verifique seu email e senha.");
      } else {
        setError("Erro ao fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <img src={logo} alt="SmartNutri Logo" className="login-logo" />
            <h1 className="login-title">Bem-vindo ao SmartNutri</h1>
            <p className="login-subtitle">Entre com suas credenciais para acessar a plataforma</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-field">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="senha">Senha</label>
              <div className="input-field">
                <FaLock className="input-icon" />
                <input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="forgot-password">
              <Link to="/esqueci-senha">Esqueceu a senha?🔐</Link>
            </div>
            
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? <><FaSpinner className="spin" /> Carregando...</> : "Entrar"}
            </button>
            
            <div className="register-options">
              <p>Não tem uma conta?</p>
              <div className="register-buttons">
                <Link to="/register" className="register-btn client">
                  Cadastrar como Cliente
                </Link>
                <Link to="/cadastro-nutricionista" className="register-btn nutritionist">
                  Cadastrar como Nutricionista
                </Link>
              </div>
            </div>
          </form>
        </div>
        
        <div className="login-banner">
          <div className="banner-content">
            <h2>Sua jornada para uma vida mais saudável começa aqui</h2>
            <p>Conecte-se com nutricionistas e receba planos alimentares personalizados para atingir seus objetivos.</p>
            <div className="banner-features">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <span>Planos alimentares personalizados</span>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <span>Acompanhamento profissional</span>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <span>Monitoramento de progresso</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}