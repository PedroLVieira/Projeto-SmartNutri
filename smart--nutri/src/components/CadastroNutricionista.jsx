import { FaEnvelope, FaLock, FaUser, FaPhone, FaFileAlt } from "react-icons/fa";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/cadastro-nutri.css";

export function CadastroNutricionista() {
  const navigate = useNavigate();

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

        <form className="form-content">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="form-input-wrapper">
              <FaEnvelope className="form-icon" />
              <input
                type="email"
                id="email"
                name="email"
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
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <div className="form-input-wrapper">
              <FaUser className="form-icon" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Digite seu nome completo"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <div className="form-input-wrapper">
              <FaPhone className="form-icon" />
              <input
                type="text"
                id="telefone"
                name="telefone"
                placeholder="(83) 9 9999-9999"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="idade">Idade</label>
            <div className="form-input-wrapper">
              <input
                type="number"
                id="idade"
                name="idade"
                placeholder="Digite sua idade"
                min="18"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="curriculo">Currículo (PDF)</label>
            <div className="form-input-wrapper">
              <FaFileAlt className="form-icon" />
              <input
                type="file"
                id="curriculo"
                name="curriculo"
                accept=".pdf"
                required
              />
            </div>
          </div>

          <button type="submit" className="form-button">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
