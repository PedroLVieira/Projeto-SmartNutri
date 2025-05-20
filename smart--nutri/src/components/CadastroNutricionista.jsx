import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { FaEnvelope, FaLock, FaUser, FaFileAlt } from "react-icons/fa";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import logo from "../assets/logo.svg";
import axios from "../axios";

export function CadastroNutricionista() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    cpf: "",
    tipo: "nutricionista"
  });
  const [curriculo, setCurriculo] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setCurriculo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const dataToSend = new FormData();
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      dataToSend.append("username", formData.username || formData.email.split('@')[0]);
      dataToSend.append("cpf", formData.cpf);
      dataToSend.append("tipo", formData.tipo);
      if (curriculo) {
        dataToSend.append("curriculo", curriculo);
      }
      const response = await axios.post(
        "/api/register/",
        dataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userType", "nutricionista");
      localStorage.setItem("userName", response.data.user.username);
      localStorage.setItem("userId", response.data.user.id);
      navigate("/dashboard-nutricionista");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.detail || "Erro ao realizar cadastro");
      } else if (error.request) {
        setError("Servidor não respondeu. Verifique sua conexão.");
      } else {
        setError("Erro ao enviar dados: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <HiOutlineArrowLeftCircle size={28} />
      </button>
      <header className="header">
        <img src={logo} alt="Smart-Nutri" className="logo" />
        <h1 className="title-box">Cadastro de Nutricionista</h1>
      </header>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="inputContainer">
          <label htmlFor="email">Email</label>
          <div className="inputWrapper">
            <FaEnvelope className="inputIcon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="inputContainer">
          <label htmlFor="password">Senha</label>
          <div className="inputWrapper">
            <FaLock className="inputIcon" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="inputContainer">
          <label htmlFor="username">Nome de usuário</label>
          <div className="inputWrapper">
            <FaUser className="inputIcon" />
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Digite seu nome de usuário"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="inputContainer">
          <label htmlFor="cpf">CPF</label>
          <div className="inputWrapper">
            <FaFileAlt className="inputIcon" />
            <input
              type="text"
              id="cpf"
              name="cpf"
              placeholder="Digite seu CPF"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="inputContainer">
          <label htmlFor="curriculo">Currículo (PDF)</label>
          <div className="inputWrapper">
            <FaFileAlt className="inputIcon" />
            <input
              type="file"
              id="curriculo"
              name="curriculo"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}