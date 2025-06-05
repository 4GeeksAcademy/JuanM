
import React, { useState, useEffect } from 'react';
import '../../styles/footer.css';

const Footer = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,cardano,solana&order=market_cap_desc&per_page=5&page=1&sparkline=false'
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener datos de la API');
        }
        
        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();

    // Actualizar cada 60 segundos
    const interval = setInterval(fetchCryptoData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="crypto-footer">
      <div className="footer-container">
        <h3 className="footer-title">Valores en tiempo real</h3>
        
        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="crypto-grid">
            {cryptoData.map((crypto) => (
              <div key={crypto.id} className="crypto-item">
                <img 
                  src={crypto.image} 
                  alt={crypto.name} 
                  className="crypto-icon"
                />
                <span className="crypto-name">{crypto.symbol.toUpperCase()}</span>
                <span className={`crypto-price ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                  ${crypto.current_price.toLocaleString()}
                </span>
                <span className={`crypto-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                  {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="footer-disclaimer">
          <p>Datos proporcionados por CoinGecko API. Actualizado cada minuto.</p>
          <p>© {new Date().getFullYear()} Tu App Financiera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
