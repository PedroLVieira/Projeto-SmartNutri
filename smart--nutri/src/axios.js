// src/axios.js
// Cópia do axios.tsx na pasta src para resolver problemas de importação

import axios from "axios";

// Criando uma instância do Axios com configuração personalizada
const instance = axios.create({
  baseURL: "http://localhost:8000", // URL base da sua API Django
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para adicionar token de autenticação
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para renovar token quando necessário
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 (não autorizado) e não for uma requisição de renovação de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentar renovar o token
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            "http://localhost:8000/api/token/refresh/",
            { refresh: refreshToken }
          );
          
          if (response.data.access) {
            localStorage.setItem("accessToken", response.data.access);
            
            // Refaz a requisição original com o novo token
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError);
        
        // Se falhar ao renovar, deslogar o usuário
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        
        // Redirecionar para a página de login (se necessário, implemente a lógica aqui)
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;