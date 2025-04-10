import logo from '../assets/logo.svg';
import "../styles/login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";

export function Login({ userType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isCadastroPage = location.pathname === "/cadastro" || location.pathname === "/cadastro-nutricionista";

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("userType", userType);
    localStorage.setItem("userName", "Michelly");

    if (userType === "Cliente") {
      navigate("/dashboard-cliente");
    } else {
      navigate("/dashboard-nutricionista");
    }
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    localStorage.setItem("userType", userType);
    localStorage.setItem("userName", "Michelly");

    if (userType === "Cliente") {
      navigate("/dashboard-cliente");
    } else {
      navigate("/dashboard-nutricionista");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <img src={logo} alt="Smart-Nutri" className="login-logo" />
          <h2 className="login-title">{isCadastroPage ? "Cadastro" : "Login"}</h2>
          <span className="login-type">{userType}</span>
        </header>

        <form className="login-form">
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

          {!isCadastroPage ? (
            <>
              <div className="forgot-password">
                <Link to="/esqueci-senha">Esqueci minha senha</Link>
              </div>
              <button className="btn primary" onClick={handleLogin}>Entrar</button>
              <p className="register-text">Não tem conta? Crie agora!</p>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  navigate(userType === "Cliente" ? "/cadastro" : "/cadastro-nutricionista");
                }}
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <button className="btn primary" onClick={handleCadastro}>Cadastrar</button>
          )}
        </form>
      </div>
    </div>
  );
}
