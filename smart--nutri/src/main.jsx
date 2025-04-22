import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App.jsx";
import { Register } from "./components/Register.jsx";
import { CadastroNutricionista } from "./components/CadastroNutricionista.jsx";
import { DashboardCliente } from "./components/DashboardCliente";
import { DashboardNutricionista } from "./components/DashboardNutricionista";
import { Perfil } from "./components/Perfil";
import { PlanoAlimentar } from "./components/PlanoAlimentar";
import { PacientePerfil } from "./components/PacientePerfil";
import { EsqueciSenha } from "./components/EsqueciSenha";
import { GerenciarPlanoAlimentar } from "./components/GerenciarPlanoAlimentar";


import "./global.css";

// Componente para capturar erros de renderização
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', margin: '20px', border: '1px solid #f88', backgroundColor: '#fee' }}>
          <h2>Algo deu errado na renderização.</h2>
          <p>Por favor, tente recarregar a página. Se o problema persistir, entre em contato com o suporte.</p>
          <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0' }}>
            <summary>Detalhes do erro (para desenvolvedores)</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children; 
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/cadastro-nutricionista" element={<CadastroNutricionista />} />
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/dashboard-nutricionista" element={<DashboardNutricionista />} />
        <Route path="/perfil" element={<Perfil userType="Cliente" userName="Michelly" />} />
        <Route path="/plano-alimentar" element={<PlanoAlimentar />} />
        <Route path="/gerenciar-plano-alimentar" element={<GerenciarPlanoAlimentar />} />
        <Route path="/paciente-perfil" element={<PacientePerfil />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
