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
  const notificationsRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }

    // Fechar dropdowns quando clicar fora
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar menu ao trocar de página
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
            <span>SmartNutri</span>
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
        </div>

        <div className="navbar-right">
          <div className="user-dropdown" ref={dropdownRef} onClick={toggleDropdown}>
            <div className="user-info">
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="user-name">{userName || "Usuário"}</span>
            </div>
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/perfil" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaUser />
                  <span>Meu Perfil</span>
                </Link>
                <Link to="/configuracoes" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaCogs />
                  <span>Configurações</span>
                </Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
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