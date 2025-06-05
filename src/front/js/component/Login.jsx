import React, { useContext, useState } from 'react';
import { Context } from "../store/appContext";
import '../../styles/Register.css';
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin, isLoading }) => {
 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { actions } = useContext(Context);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await actions.loginUser(formData.email, formData.password);
    if(response.success) {
      console.log("Usuario logueado");
      navigate("/home");
    } else {
      // error(response.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Iniciar Sesión</h2>
      
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
        
        <button 
          className="auth-button" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <p className="auth-switch">
        ¿No tienes cuenta? <a href="/">Regístrate aquí</a>
      </p>
    </div>
  );
};

export default Login;