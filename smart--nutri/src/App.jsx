import { useState } from "react";
import { FaUser, FaUserMd } from "react-icons/fa"; // Ícones
import { Login } from "./components/login.jsx";

import "./global.css"; // Caso precise estilizar os botões

export function App() {
  const [userType, setUserType] = useState("Cliente");

  return (
    <div>
      <div className="switch-container">
        <button 
          className={`switch-button ${userType === "Cliente" ? "active" : ""}`}
          onClick={() => setUserType("Cliente")}
        >
          <FaUser /> Cliente
        </button>

        <button 
          className={`switch-button ${userType === "Nutricionista" ? "active" : ""}`}
          onClick={() => setUserType("Nutricionista")}
        >
          <FaUserMd /> Nutricionista
        </button>
      </div>

      <Login userType={userType} />
    </div>
  );
}
