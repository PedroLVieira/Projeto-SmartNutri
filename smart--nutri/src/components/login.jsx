import logo from '../assets/logo.svg';
import "../styles/login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  // Estado de carregamento
  const [error, setError] = useState("");         // Estado para erro de login

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.senha.value;

    if (!email || !password) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    setError(""); // Limpar qualquer erro anterior
    setLoading(true); // Ativar loader

    try {
      const response = await fetch("http://seu-backend.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      setLoading(false); // Desativar loader após a requisição

      if (!response.ok) {
        throw new Error("Credenciais inválidas!");
      }

      const data = await response.json();

      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userName", data.userName);

      // Redirecionamento baseado no tipo de usuário
      if (data.userType === "Cliente") {
        navigate("/dashboard-cliente");
      } else if (data.userType === "Nutricionista") {
        navigate("/dashboard-nutricionista");
      } else {
        setError("Tipo de usuário desconhecido!");
      }
    } catch (error) {
      setLoading(false); // Desativar loader
      setError(error.message); // Definir erro de login
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

          {error && <p className="error-message">{error}</p>} {/* Mensagem de erro */}

          <div className="forgot-password">
            <Link to="/esqueci-senha">Esqueci minha senha</Link>
          </div>

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}  {/* Exibe 'Carregando...' durante o login */}
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
