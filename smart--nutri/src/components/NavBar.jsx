import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaUtensils, FaChartLine, FaHome, FaCogs } from "react-icons/fa";
import "../styles/navbar.css";
import logo from "../assets/logo.svg";

const NavBar = ({ userType }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    
    // Fechar ao pressionar a tecla Escape
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Fechar menu ao trocar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };  const toggleDropdown = (event) => {
    // Previne que o evento propague para outros elementos
    event.stopPropagation();
    event.preventDefault();
    setDropdownOpen(!dropdownOpen);
    
    // Se estamos abrindo o dropdown, define um temporizador para fechar se o usuário clicar fora
    if (!dropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', closeDropdown, { once: true });
      }, 0);
    }
  };
  
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    
    // Redirecionar para o login
    navigate("/login");
  };

  // Definir links de navegação com base no tipo de usuário
  const getNavLinks = () => {
    if (userType === "nutricionista") {
      return [
        { to: "/dashboard-nutricionista", icon: <FaHome />, text: "Dashboard" },
        { to: "/gerenciar-plano-alimentar", icon: <FaUtensils />, text: "Planos Alimentares" }
      ];
    } else {
      return [
        { to: "/dashboard-cliente", icon: <FaHome />, text: "Dashboard" },
        { to: "/plano-alimentar", icon: <FaUtensils />, text: "Plano Alimentar" }
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to={userType === "nutricionista" ? "/dashboard-nutricionista" : "/dashboard-cliente"}>
            <img src={logo} alt="SmartNutri Logo" />
          </Link>
        </div>

        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`navbar-item ${location.pathname === link.to ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              <span>{link.text}</span>
            </Link>
          ))}
        </div>        <div className="navbar-right">          <div className="user-dropdown" ref={dropdownRef}>
            <div className={`user-info ${dropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="user-name">{userName || "Usuário"}</span>
            </div>
            
            {dropdownOpen && <div className="dropdown-backdrop" onClick={() => setDropdownOpen(false)}></div>}
              {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 5px)',
                right: 0,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                minWidth: '220px',
                padding: '0.5rem',
                zIndex: 1100,
                border: '1px solid #e0e0e0',
              }}>
                <div style={{
                  content: '',
                  position: 'absolute',
                  top: '-8px',
                  right: '22px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  transform: 'rotate(45deg)',
                  borderLeft: '1px solid #e0e0e0',
                  borderTop: '1px solid #e0e0e0',
                  zIndex: -1,
                }}></div>
                <Link 
                  to="/perfil" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '4px',
                    color: '#212121',
                    textDecoration: 'none',
                    fontWeight: 500,
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    marginBottom: '2px'
                  }} 
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUser />
                  <span>Meu Perfil</span>
                </Link>
                
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '4px',
                    color: '#212121',
                    textDecoration: 'none',
                    fontWeight: 500,
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    marginTop: '4px',
                    borderTop: '1px solid #e0e0e0',
                    paddingTop: '8px'
                  }} 
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      
      {menuOpen && <div className="menu-backdrop" onClick={toggleMenu}></div>}
    </nav>
  );
};

export default NavBar;