import React, { useContext, useState } from 'react';
import { Context } from "../store/appContext";
import '../../styles/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState(null); // Para mensajes de éxito/error
  const navigate = useNavigate();
  const { actions } = useContext(Context);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    const response = await actions.registerUser({
      email: formData.email,
      password: formData.password
    });

    if (response.success) {
      setNotification({ message: "¡Registro exitoso!", type: "success" });
      setTimeout(() => navigate("/login"), 2000); // Redirige después de 2 segundos
    } else {
      setNotification({ message: response.message, type: "error" });
    }
  };

  // ✅ Asegúrate de que el componente SIEMPRE retorne JSX
  return (
    <div className="auth-container">
      <h2 className="auth-title">Registrarse</h2>
      
      {/* Mostrar notificación si existe */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        
        <input
          className="auth-input"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <input
          className="auth-input"
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        
        <button 
          className="auth-button" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>
      
      <p className="auth-switch">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default Register;





