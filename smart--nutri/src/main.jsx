import React from "react";
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


import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/cadastro-nutricionista" element={<CadastroNutricionista />} />
      <Route path="/dashboard-cliente" element={<DashboardCliente />} />
      <Route path="/dashboard-nutricionista" element={<DashboardNutricionista />} />
      <Route path="/perfil" element={<Perfil userType="Cliente" userName="Michelly" />} />
      <Route path="/plano-alimentar" element={<PlanoAlimentar />} />
      <Route path="/paciente-perfil" element={<PacientePerfil />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />

    </Routes>
  </BrowserRouter>
);
