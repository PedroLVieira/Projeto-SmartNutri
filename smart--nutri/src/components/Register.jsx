import "../styles/register.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaFileAlt } from "react-icons/fa";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import logo from "../assets/logo.svg";

export function Register({ userType }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <HiOutlineArrowLeftCircle size={28} />
      </button>

      <header className="header">
        <img src={logo} alt="Smart-Nutri" className="logo" />
        <h1 className="title-box">Cadastro</h1>
      </header>

      <form>
        <div className="inputContainer">
          <label htmlFor="email">Email</label>
          <div className="inputWrapper">
            <FaEnvelope className="inputIcon" />
            <input type="email" id="email" name="email" placeholder="Digite seu email" />
          </div>
        </div>

        <div className="inputContainer">
          <label htmlFor="password">Senha</label>
          <div className="inputWrapper">
            <FaLock className="inputIcon" />
            <input type="password" id="password" name="password" placeholder="Digite sua senha" />
          </div>
        </div>

        <div className="inputContainer">
          <label htmlFor="name">Nome</label>
          <div className="inputWrapper">
            <FaUser className="inputIcon" />
            <input type="text" id="name" name="name" placeholder="Digite seu nome" />
          </div>
        </div>

        {userType === "Nutricionista" && (
          <div className="inputContainer">
            <label htmlFor="curriculo">Currículo</label>
            <div className="inputWrapper">
              <FaFileAlt className="inputIcon" />
              <input type="file" id="curriculo" name="curriculo" />
            </div>
          </div>
        )}

        <div className="inputContainer">
          <label htmlFor="telefone">Telefone</label>
          <div className="inputWrapper">
            <FaPhone className="inputIcon" />
            <input type="text" id="telefone" name="telefone" placeholder="(83) 9 9999-9999" />
          </div>
        </div>

        <div className="inputContainer">
          <label htmlFor="idade">Idade</label>
          <div className="inputWrapper">
            <input type="text" id="idade" name="idade" placeholder="Digite sua idade" />
          </div>
        </div>

        <button className="button">Cadastrar</button>
      </form>
    </div>
  );
}
