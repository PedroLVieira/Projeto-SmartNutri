import logo from '../assets/logo.svg';
import "../styles/login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const API_URL = "http://127.0.0.1:8000";

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
      // Use o nome de campo que o backend está esperando (username em vez de email)
      const response = await axios.post(`${API_URL}/api/token/`, {
        username: email, // Mudança chave: usando username em vez de email
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 segundos de timeout
      });

      setLoading(false);
      
      // Se chegarmos aqui, a resposta foi bem-sucedida
      const data = response.data;
      
      // Salvar tokens e informações do usuário
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      
      // Fazer uma segunda requisição para obter os dados do usuário usando o token
      try {
        const userResponse = await axios.get(`${API_URL}/api/user/me/`, {
          headers: {
            'Authorization': `Bearer ${data.access}`
          }
        });
        
        const userData = userResponse.data;
        localStorage.setItem("userType", userData.tipo || "cliente");
        localStorage.setItem("userName", userData.username || userData.email);
        
        // Redirecionamento baseado no tipo de usuário
        if (userData.tipo === "cliente") {
          navigate("/dashboard-cliente");
        } else if (userData.tipo === "nutricionista") {
          navigate("/dashboard-nutricionista");
        } else {
          // Default para cliente se não tiver tipo específico
          navigate("/dashboard-cliente");
        }
      } catch (userError) {
        console.error("Erro ao obter dados do usuário:", userError);
        
        // Mesmo se não conseguirmos obter os dados detalhados do usuário,
        // sabemos que o login foi bem-sucedido, então redirecionamos para uma página padrão
        navigate("/dashboard-cliente");
      }
    } catch (error) {
      setLoading(false);
      
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        if (error.response.status === 401) {
          setError("Email ou senha incorretos");
        } else {
          setError(`Erro no servidor: ${error.response.data.detail || error.response.status}`);
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        setError("Sem resposta do servidor. Verifique sua conexão ou se o backend está em execução.");
      } else {
        // Algo aconteceu na configuração da requisição que gerou um erro
        setError(`Erro: ${error.message}`);
      }
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
