import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../global.css";
import axios from "../axios";

export function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const API_URL = "http://localhost:8000";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    setError(""); // Limpa mensagens de erro anteriores
    setLoading(true); // Ativa o estado de carregamento

    try {
      // Usando axios para melhor tratamento de erros
      const response = await axios.post("/api/token/", {
        username: email, // Usando username em vez de email para compatibilidade com JWT 
        password: password
      });

      setLoading(false);
      
      // Se chegarmos aqui, a resposta foi bem-sucedida
      const data = response.data;

      // Armazena os tokens e informações básicas no localStorage
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      
      // Tentamos obter dados adicionais do usuário
      try {
        const userResponse = await axios.get("/api/user/me/");
        
        const userData = userResponse.data;
        localStorage.setItem("userType", userData.tipo || "cliente");
        localStorage.setItem("userName", userData.username || userData.email);
        localStorage.setItem("userId", userData.id);
        
        // Redirecionamento específico para cliente
        navigate("/dashboard-cliente");
      } catch (userError) {
        console.error("Erro ao buscar detalhes do usuário:", userError);
        // Mesmo sem os detalhes completos, sabemos que é um cliente
        localStorage.setItem("userType", "cliente");
        navigate("/dashboard-cliente");
      }
    } catch (error) {
      setLoading(false);
      
      if (error.response) {
        // O servidor respondeu com status de erro
        if (error.response.status === 401) {
          setError("Email ou senha incorretos");
        } else {
          setError(`Erro no servidor: ${error.response.data.detail || error.response.status}`);
        }
      } else if (error.request) {
        // Não houve resposta do servidor
        setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      } else {
        setError(error.message);
      }
      console.error("Erro de login:", error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Smart-Nutri" />
        <span className="title">Cliente</span>
      </header>

      <form onSubmit={handleLogin}>
        <div className="inputContainer">
          <label htmlFor="email">E-mail:</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Digite aqui seu Email!"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Digite aqui sua Senha!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </button>

        <p className="register-text">Não tem conta? Crie agora!</p>
        <button
          className="button"
          type="button"
          onClick={() => navigate("/cadastro")}
        >
          Cadastre-se
        </button>
      </form>
    </div>
  );
}
