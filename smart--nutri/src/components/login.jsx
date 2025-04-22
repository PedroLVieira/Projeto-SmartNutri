import logo from '../assets/logo.svg';
import "../styles/login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import axios from "axios";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.senha.value;

    if (!email || !password) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password
      });

      const data = response.data;
      console.log("Dados do usuário recebidos:", data);
      
      // Salvar tokens e dados do usuário
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userType", data.user.tipo);
      localStorage.setItem("userName", data.user.username);
      localStorage.setItem("userId", data.user.id.toString());  // Adicionando o ID do usuário
      
      console.log("ID do usuário armazenado:", data.user.id);

      // Redirecionamento baseado no tipo de usuário
      if (data.user.tipo === "cliente") {
        navigate("/dashboard-cliente");
      } else if (data.user.tipo === "nutricionista") {
        navigate("/dashboard-nutricionista");
      } else {
        setError("Tipo de usuário desconhecido!");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      setError(error.response?.data?.detail || "Credenciais inválidas!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <img src={logo} alt="Smart-Nutri" className="login-logo" />
          <h2 className="login-title">Login</h2>
        </header>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">E-mail:</label>
            <div className="input-field">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite aqui seu Email!"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha:</label>
            <div className="input-field">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite aqui sua Senha!"
                required
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="forgot-password">
            <Link to="/esqueci-senha">Esqueci minha senha</Link>
          </div>

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </button>

          <p className="register-text">Ainda não tem conta?</p>
          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate("/cadastro")}
          >
            Cadastre-se
          </button>
        </form>
      </div>
    </div>
  );
}