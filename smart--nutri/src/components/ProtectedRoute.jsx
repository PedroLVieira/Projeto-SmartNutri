import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../axios';

/**
 * Componente para proteger rotas baseado no tipo de usuário
 * @param {Object} props 
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado
 * @param {string} props.allowedUserType - Tipo de usuário permitido ('cliente', 'nutricionista' ou 'any')
 * @returns {React.ReactNode}
 */
export const ProtectedRoute = ({ children, allowedUserType = 'any' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verificar se o token é válido e obter o tipo de usuário
        const userTypeStored = localStorage.getItem('userType');
        
        // Se temos um tipo de usuário armazenado, podemos usar isso inicialmente
        setUserType(userTypeStored);
        setIsAuthenticated(true);
        
        // Verificar no servidor se o token ainda é válido
        try {
          // O endpoint /api/token/verify/ espera o token no corpo da requisição
          await axios.post('/api/token/verify/', {
            token: token
          });
          // Se chegou aqui, o token é válido
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userType');
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    // Exibir um loading enquanto verifica a autenticação
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Usuário não está autenticado, redirecionar para login
    return <Navigate to="/login" />;
  }

  // Se o tipo de usuário for especificado e não corresponder ao permitido
  if (allowedUserType !== 'any' && userType !== allowedUserType) {
    // Redirecionar para o dashboard correto
    if (userType === 'nutricionista') {
      return <Navigate to="/dashboard-nutricionista" />;
    } else {
      return <Navigate to="/dashboard-cliente" />;
    }
  }

  // Se passou por todas as verificações, renderizar os filhos
  return children;
};