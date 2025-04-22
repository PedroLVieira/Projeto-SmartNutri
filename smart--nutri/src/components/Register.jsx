import "../styles/register.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaFileAlt } from "react-icons/fa";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import logo from "../assets/logo.svg";
import axios from "axios";
import { useState } from "react";

export function Register({ userType = "cliente" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    telefone: "",
    idade: "",
    cpf: "",
    tipo: userType // Usar o userType recebido como prop
  });

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
        "http://localhost:8000/api/register/", 
        dataToSend
      );
      
      // Salva os tokens e informações do usuário no localStorage
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userType", response.data.user.tipo);
      localStorage.setItem("userName", response.data.user.username);
      
      // Redirecionar para o dashboard apropriado
      if (response.data.user.tipo === "cliente") {
        navigate("/dashboard-cliente");
      } else {
        navigate("/dashboard-nutricionista");
      }
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
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <HiOutlineArrowLeftCircle size={28} />
      </button>

      <header className="header">
        <img src={logo} alt="Smart-Nutri" className="logo" />
        <h1 className="title-box">Cadastro</h1>
      </header>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
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
          <label htmlFor="telefone">Telefone</label>
          <div className="inputWrapper">
            <FaPhone className="inputIcon" />
            <input 
              type="text" 
              id="telefone" 
              name="telefone" 
              placeholder="(83) 9 9999-9999" 
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="inputContainer">
          <label htmlFor="idade">Idade</label>
          <div className="inputWrapper">
            <input 
              type="text" 
              id="idade" 
              name="idade" 
              placeholder="Digite sua idade" 
              value={formData.idade}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="inputContainer">
          <label htmlFor="tipo">Tipo de Usuário</label>
          <div className="inputWrapper">
            <select 
              id="tipo" 
              name="tipo" 
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="cliente">Cliente</option>
              <option value="nutricionista">Nutricionista</option>
            </select>
          </div>
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
