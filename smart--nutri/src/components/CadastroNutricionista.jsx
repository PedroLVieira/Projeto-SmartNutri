import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cadastro-nutri.css";
import { FaUser, FaEnvelope, FaLock, FaFileAlt } from "react-icons/fa";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import logo from "../assets/logo.svg";
import axios from "../axios";

export function CadastroNutricionista() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    cpf: "",
    tipo: "nutricionista" // Tipo fixado como nutricionista
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Certifica-se de que o campo username tem um valor
      const dataToSend = {
        ...formData,
        username: formData.username || formData.email.split('@')[0]
      };

      // Envia os dados para a API de cadastro
      const response = await axios.post(
        "/api/register/", 
        dataToSend
      );
      
      // Salva os tokens e informações do usuário no localStorage
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userType", "nutricionista");
      localStorage.setItem("userName", response.data.user.username);
      localStorage.setItem("userId", response.data.user.id);
      
      // Redirecionar para o dashboard do nutricionista
      navigate("/dashboard-nutricionista");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      
      if (error.response) {
        // O servidor respondeu com um código de erro
        setError(error.response.data.detail || "Erro ao realizar cadastro");
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        setError("Servidor não respondeu. Verifique sua conexão.");
      } else {
        // Erro na configuração da requisição
        setError("Erro ao enviar dados: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <div className="form-header">
          <button className="back-button-inside" onClick={() => navigate(-1)}>
            <HiOutlineArrowLeftCircle size={28} />
          </button>
          <img src={logo} alt="Smart-Nutri" className="form-logo" />
          <h1 className="form-title">Cadastro de Nutricionista</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="form-input-wrapper">
              <FaEnvelope className="form-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="form-input-wrapper">
              <FaLock className="form-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Nome de usuário</label>
            <div className="form-input-wrapper">
              <FaUser className="form-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Digite seu nome de usuário"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <div className="form-input-wrapper">
              <FaFileAlt className="form-icon" />
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="Digite seu CPF"
                required
              />
            </div>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}