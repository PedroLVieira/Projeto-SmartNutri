import logo from './assets/logo.svg';
import "./global.css";


export function App() {
  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Smart-Nutri" />
        <span className="title">Nutricionista</span>
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

        <a href="#" className="forgot-password">Esqueci minha senha</a>

        <button className="button">Entrar</button>

        <p className="register-text">Não tem conta? Crie agora!</p>
        <button className="button">Cadastre-se</button>
      </form>
    </div>
  );
}
