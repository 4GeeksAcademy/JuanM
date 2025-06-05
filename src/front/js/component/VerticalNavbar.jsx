import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const VerticalNavbar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  // Datos por defecto seguros
  const defaultNavItems = [
    { path: '/', icon: '🏠', label: 'Inicio' },
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  ];

  const [navItems, setNavItems] = useState(defaultNavItems);

  if (!navItems || !Array.isArray(navItems)) {
    console.error('navItems debe ser un array');
    return <div className="p-4 bg-yellow-100">Error en la configuración del menú</div>;
  }

  return (
    <nav className={`h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col ${expanded ? 'w-64' : 'w-20'}`}>
      {/* Contenido del navbar */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {expanded && <h1 className="text-xl font-bold">MiApp</h1>}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-full hover:bg-gray-700"
          aria-label={expanded ? 'Contraer menú' : 'Expandir menú'}
        >
          {expanded ? '◀' : '▶'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path || item.label}>
              <Link
                to={item.path || '#'}
                className={`flex items-center p-4 hover:bg-gray-700 transition-colors ${
                  location.pathname === item.path ? 'bg-gray-900' : ''
                }`}
              >
                <span className="text-2xl mr-3">{item.icon || '○'}</span>
                {expanded && <span>{item.label || 'Item'}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default VerticalNavbar;