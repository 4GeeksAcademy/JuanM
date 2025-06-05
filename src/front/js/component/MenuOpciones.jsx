import React, { useState } from 'react';
import '../../styles/menuopciones.css'; // Archivo CSS para los estilos

const MenuOpciones = () => {
  const [activeItem, setActiveItem] = useState(null);

  const opciones = [
    { id: 1, nombre: 'Inicio', icono: '🏠' },
    { id: 2, nombre: 'Perfil', icono: '👤' },
    { id: 3, nombre: 'Mensajes', icono: '✉️' },
    { id: 4, nombre: 'Configuración', icono: '⚙️' },
    { id: 5, nombre: 'Ayuda', icono: '❓' },
  ];

  const handleClick = (id) => {
    setActiveItem(id);
    // Aquí puedes agregar la lógica para manejar la selección
    console.log(`Opción seleccionada: ${opciones.find(op => op.id === id).nombre}`);
  };

  return (
    <div className="menu-container">
      <div className="menu-centrado">
        <h2 className="menu-titulo">Menú de Opciones</h2>
        <ul className="menu-lista">
          {opciones.map((opcion) => (
            <li
              key={opcion.id}
              className={`menu-item ${activeItem === opcion.id ? 'active' : ''}`}
              onClick={() => handleClick(opcion.id)}
            >
              <span className="menu-icono">{opcion.icono}</span>
              <span className="menu-texto">{opcion.nombre}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuOpciones;