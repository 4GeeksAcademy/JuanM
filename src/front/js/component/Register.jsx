// import React, { useContext, useState } from 'react';
// import { Context } from "../store/appContext";
// import '../../styles/Register.css'


// const Register = ({ onLogin, onRegister, isLoading }) => {
//   const [isLogin, setIsLogin] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const { actions } = useContext(Context);


//     const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });


//     const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     const response = await actions.registerUser(formData);
//         if(response.success){
//             success("Usuario registrado");
//             navigate("/")
//         }else{
//             errors(response.message)
//         }
//   };

//   return (
//     <div className="auth-container">
//       <h2 className="auth-title">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      
//       <form onSubmit={handleSubmit}>
//         <input
//           className="auth-input"
//           type="email"
//           name="email" 
//           value={formData.email}
//           placeholder="Email"
//           onChange={handleChange}
//           required
//         />
        
//         <input
//           className="auth-input"
//           type="password"
//           name="password" 
//           placeholder="Contraseña"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
        
//         {!isLogin && (
//           <input
//             className="auth-input"
//             type="password"
//             name="confirmPassword" 
//             placeholder="Confirmar Contraseña"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//         )}
        
//         <button 
//           className="auth-button" 
//           type="submit"
//           disabled={isLoading}
//         >
//           {isLoading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
//         </button>
//       </form>
      
//       <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
//         {isLogin 
//           ? '¿No tienes cuenta? Regístrate aquí' 
//           : '¿Ya tienes cuenta? Inicia sesión aquí'}
//       </p>
//     </div>
//   );
// };

// export default Register;

import React, { useContext, useState } from 'react';
import { Context } from "../store/appContext";
import '../../styles/Register.css';

const Register = ({ onRegister, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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
    if(formData.password !== formData.confirmPassword) {
      // error("Las contraseñas no coinciden");
      return;
    }
    
    const response = await actions.registerUser({
      email: formData.email,
      password: formData.password
    });
    
    if(response.success) {
      // success("Usuario registrado");
      navigate("/login");
    } else {
      // error(response.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Registrarse</h2>
      
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





