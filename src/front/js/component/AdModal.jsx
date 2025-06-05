// components/AdModal.jsx
import React, { useState, useEffect } from 'react';

const AdModal = () => {
  const [showAd, setShowAd] = useState(false);
  const adContent = {
    title: "¡Oferta Especial!",
    message: "Regístrate hoy y obtén un análisis premium gratis"
  };

  useEffect(() => {
    // Mostrar anuncio después de 30 segundos
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null;

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <h2>{adContent.title}</h2>
        <p>{adContent.message}</p>
        <button onClick={() => setShowAd(false)}>Cerrar</button>
      </div>
    </div>
  );
};

export default AdModal;