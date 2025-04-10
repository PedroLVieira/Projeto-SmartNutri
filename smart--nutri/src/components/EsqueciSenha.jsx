import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/esqueci-senha.css";

export function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleEnviar = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setMensagem("Por favor, informe seu e-mail.");
      return;
    }

    // Simulação de envio
    setMensagem("Um link de redefinição foi enviado para seu e-mail.");
    setEmail("");
  };

  return (
    <div className="esqueci-senha-container">
      <h2>Esqueceu sua senha?</h2>
      <p>Digite seu e-mail para receber um link de redefinição.</p>

      <form onSubmit={handleEnviar}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Enviar link</button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <button className="voltar" onClick={() => navigate("/")}>
        ← Voltar para login
      </button>
    </div>
  );
}
