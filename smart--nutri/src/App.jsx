import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/login.jsx";
import { Register } from "./components/Register.jsx";
import { CadastroNutricionista } from "./components/CadastroNutricionista.jsx";
import { DashboardCliente } from "./components/DashboardCliente.jsx";
import { DashboardNutricionista } from "./components/DashboardNutricionista.jsx";
import { Perfil } from "./components/Perfil.jsx";
import { PlanoAlimentar } from "./components/PlanoAlimentar.jsx";
import { GerenciarPlanoAlimentar } from "./components/GerenciarPlanoAlimentar.jsx";
import { EsqueciSenha } from "./components/EsqueciSenha.jsx";
import { PacientePerfil } from "./components/PacientePerfil.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import "./global.css";

export function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cadastro-nutricionista" element={<CadastroNutricionista />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      
      {/* Redirecionar raiz para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rotas protegidas para clientes */}
      <Route 
        path="/dashboard-cliente" 
        element={
          <ProtectedRoute allowedUserType="cliente">
            <DashboardCliente />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/plano-alimentar" 
        element={
          <ProtectedRoute allowedUserType="cliente">
            <PlanoAlimentar />
          </ProtectedRoute>
        } 
      />

      {/* Rotas protegidas para nutricionistas */}
      <Route 
        path="/dashboard-nutricionista" 
        element={
          <ProtectedRoute allowedUserType="nutricionista">
            <DashboardNutricionista />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gerenciar-plano-alimentar" 
        element={
          <ProtectedRoute allowedUserType="nutricionista">
            <GerenciarPlanoAlimentar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/gerenciar-plano-alimentar/:pacienteId" 
        element={
          <ProtectedRoute allowedUserType="nutricionista">
            <GerenciarPlanoAlimentar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/paciente-perfil" 
        element={
          <ProtectedRoute allowedUserType="nutricionista">
            <PacientePerfil />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/paciente/:pacienteId" 
        element={
          <ProtectedRoute allowedUserType="nutricionista">
            <PacientePerfil />
          </ProtectedRoute>
        } 
      />
      
      {/* Rota para perfil acessível para ambos os tipos de usuários */}
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute allowedUserType="any">
            <Perfil />
          </ProtectedRoute>
        } 
      />
      
      {/* Rota de relatórios para nutricionista */}
      <Route 
        path="/relatorios" 
        element={
          <ProtectedRoute allowedUserType="nutricionista">
            <div>Relatórios em desenvolvimento</div>
          </ProtectedRoute>
        } 
      />

      {/* Rota para página não encontrada */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}