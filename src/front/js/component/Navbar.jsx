import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import '../../styles/navbarfinanzas.css';
import { Context } from '../store/appContext';
import { FaTrashAlt } from 'react-icons/fa';

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
        // actions.setEmail(storedEmail);
      }
    }
  }, [store.email]);



  const handleLogout = () => {
    actions.logoutUser();
    // Redirige al login después de cerrar sesión
    window.location.href = '/login';
  };
  // const handleDelete = () => {
  //   actions.deleteUser();
  //   // Redirige al login después de eliminar
  //   window.location.href = '/login';
  // };

const handleDelete = async () => {
  if (window.confirm("¿Estás seguro de eliminar tu cuenta?")) {
    try {
      // Opción 1: Obtener el ID del localStorage (si lo guardaste al login)
      const userId = localStorage.getItem("id");

      // Opción 2: Obtener el ID del store (si existe)
      // const userId = store.user?.id;

      if (!userId) throw new Error("No se pudo obtener el ID del usuario");

      await actions.deleteUser(userId);
      actions.logoutUser();
      window.location.href = '/login';
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      alert("Error al eliminar la cuenta: " + error.message);
    }
  }
};

  return (
    <nav className="navbar-finanzas">
      <div className="navbar-container">
        {/* Logo y marca */}
        <Link to="/" className="navbar-brand">
          <GiTwoCoins className="logo-icon" />
          <span className="brand-name">InfoFinanzas</span>
        </Link>


        {/* Menú principal */}
        <div className="navbar-links">
          <Link to="/home" className="nav-link">Dashboard</Link>
          <Link to="/mercados" className="nav-link">Mercados</Link>
          <Link to="/inversiones" className="nav-link">Predicciones</Link>
          <Link to="/historial" className="nav-link">Historial</Link>
         
        </div>

        {/* Área de usuario */}
        <div className="user-area">
    
          <div className="user-profile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaUserCircle className="user-avatar" />
            <span className="user-email">{email || 'Cargando...'}</span>
            
            {isMenuOpen && (
              <div className="user-dropdown">
                 {/* <Link to="/password" className="dropdown-item">
                  <FaCog /> Cambiar Contraseña
                </Link>  */}
                <button onClick={handleDelete} className="dropdown-item">
                  <FaCog /> Eliminar Cuenta
                </button>
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




