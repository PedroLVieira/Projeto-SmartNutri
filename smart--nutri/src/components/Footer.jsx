import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="SmartNutri Logo" />
            <h3>SmartNutri</h3>
          </div>
          <p className="footer-description">
            Plataforma completa para gerenciamento de planos alimentares e acompanhamento nutricional. Conectando nutricionistas e pacientes para uma vida mais saudável.
          </p>
        </div>

        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul className="footer-links">
            <li><Link to="/sobre">Sobre Nós</Link></li>
            <li><Link to="/servicos">Serviços</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">Perguntas Frequentes</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Para Nutricionistas</h4>
          <ul className="footer-links">
            <li><Link to="/cadastro-nutricionista">Cadastre-se</Link></li>
            <li><Link to="/recursos">Recursos</Link></li>
            <li><Link to="/como-funciona">Como Funciona</Link></li>
            <li><Link to="/depoimentos">Depoimentos</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contato</h4>
          <address className="footer-contact">
            <p><FaMapMarkerAlt /> Av. Exemplo, 1234, São Paulo - SP</p>
            <p><FaPhone /> (11) 98765-4321</p>
            <p><FaEnvelope /> contato@smartnutri.com.br</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} SmartNutri. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;