
import React, { useState, useEffect } from 'react';
import '../../styles/NewsTicker.css';

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://improved-dollop-j6w4v4vvqvr2xrr-3001.app.github.dev/api/news', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Upgrade': 'HTTP/2.0'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        
        const data = await response.json();
        setNews(data.articles || data.slice(0, 50)); // Usa data.articles si existe, sino los primeros 5 items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("No se pudieron cargar las noticias");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="ticker-container">
      <div className="ticker-label">Últimas noticias:</div>
      <div className="ticker-content">
        {loading ? (
          <span>Cargando noticias...</span>
        ) : error ? (
          <span>{error}</span>
        ) : news.length === 0 ? (
          <span>No hay noticias disponibles</span>
        ) : (
          <div className="ticker-items"> 
            {news.map((item) => (
              <span key={item.url || item.id} className="ticker-item">
                {item.title} | 
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsTicker;