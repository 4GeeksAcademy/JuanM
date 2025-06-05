import React, { useContext, useState } from 'react';
import { Context } from "../store/appContext";
import '../../styles/Register.css';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { actions } = useContext(Context);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores al escribir
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) newErrors.currentPassword = 'La contraseña actual es requerida';
    if (!formData.newPassword) newErrors.newPassword = 'La nueva contraseña es requerida';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Mínimo 8 caracteres';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  try {
    const response = await actions.changePassword(
      formData.currentPassword,
      formData.newPassword
    );
    
    if (response.success) {
      alert(response.message || 'Contraseña cambiada exitosamente');
      navigate("/home");
    } else {
      setErrors({ 
        submit: response.message || 'Error al cambiar la contraseña' 
      });
    }
  } catch (error) {
    setErrors({ 
      submit: 'Error inesperado. Por favor intenta nuevamente.' 
    });
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};

  const toggleShowPassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Cambiar Contraseña</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Contraseña Actual */}
        <div className="password-input-container">
          <input
            className={`auth-input ${errors.currentPassword ? 'input-error' : ''}`}
            type={showPassword.current ? "text" : "password"}
            name="currentPassword" 
            value={formData.currentPassword}
            placeholder="Contraseña Actual"
            onChange={handleChange}
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => toggleShowPassword('current')}
          >
            {showPassword.current ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.currentPassword && (
            <span className="error-message">{errors.currentPassword}</span>
          )}
        </div>

        {/* Nueva Contraseña */}
        <div className="password-input-container">
          <input
            className={`auth-input ${errors.newPassword ? 'input-error' : ''}`}
            type={showPassword.new ? "text" : "password"}
            name="newPassword" 
            placeholder="Nueva Contraseña (mínimo 8 caracteres)"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => toggleShowPassword('new')}
          >
            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.newPassword && (
            <span className="error-message">{errors.newPassword}</span>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div className="password-input-container">
          <input
            className={`auth-input ${errors.confirmPassword ? 'input-error' : ''}`}
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword" 
            placeholder="Confirmar Nueva Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => toggleShowPassword('confirm')}
          >
            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {errors.submit && (
          <div className="submit-error">{errors.submit}</div>
        )}

        <button 
          className="auth-button" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </button>
      </form>
      
      <p className="auth-switch">
        <a href="/profile">Volver al perfil</a>
      </p>
    </div>
  );
};

export default ChangePassword;