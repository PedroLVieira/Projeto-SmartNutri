import logo from './assets/logo.svg';
import "./global.css";

export function App() {
  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Smart-Nutri" />
        <span className="title">Cliente</span>
      </header>

      <form>
        <div className="inputContainer">
          <label htmlFor="email">E-mail:</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Digite aqui seu Email!"
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Digite aqui sua Senha!"
          />
        </div>

        <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
          Esqueci minha senha
        </a>

        <button className="button" aria-label="Entrar">Entrar</button>

        <p className="register-text">Não tem conta? Crie agora!</p>
        <button className="button" onClick={(e) => e.preventDefault()}>
          Cadastre-se
        </button>
      </form>
    </div>
  );
}
