import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import '../../styles/navbarfinanzas.css';
import { Context } from '../store/appContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Actualiza el email cuando cambie en el store
    if (store.email) {
      setEmail(store.email);
    } else {
      // Opcional: intenta obtenerlo de localStorage si no está en el store
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
        // Actualiza el store si es necesario
        actions.setEmail(storedEmail);
      }
    }
  }, [store.email]);

  const handleLogout = () => {
    actions.logoutUser();
    // Redirige al login después de cerrar sesión
    window.location.href = '/login';
  };

  return (
    <nav className="navbar-finanzas">
      <div className="navbar-container">
        {/* Logo y marca */}
        <Link to="/" className="navbar-brand">
          <GiTwoCoins className="logo-icon" />
          <span className="brand-name">CryptoFinanzas</span>
        </Link>

        {/* Menú principal */}
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/mercados" className="nav-link">Mercados</Link>
          <Link to="/inversiones" className="nav-link">Inversiones</Link>
          <Link to="/historial" className="nav-link">Historial</Link>
        </div>

        {/* Área de usuario */}
        <div className="user-area">
          <button className="notification-btn">
            <FaBell />
            {notifications > 0 && <span className="notification-badge">{notifications}</span>}
          </button>

          <div className="user-profile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaUserCircle className="user-avatar" />
            <span className="user-email">{email || 'Cargando...'}</span>
            
            {isMenuOpen && (
              <div className="user-dropdown">
                <Link to="/perfil" className="dropdown-item">
                  <FaUserCircle /> Mi Perfil
                </Link>
                <Link to="/configuracion" className="dropdown-item">
                  <FaCog /> Configuración
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                  <FaSignOutAlt /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


