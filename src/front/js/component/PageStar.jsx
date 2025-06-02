import React, { useState, useEffect } from 'react';
import '../../styles/pagestar.css'
import NewsTicker from './NewsTicker.jsx';


const PageStar = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch a la API de criptomonedas 
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }

        const data = await response.json();
        setCryptos(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []); // [] → Se ejecuta solo al montar el componente

  // 🔹 Renderizado condicional (carga, error o datos)
  if (loading) return <div className="loading">Cargando criptomonedas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
 
    <div className="home-container">
    
      <h2>Top 10 Criptomonedas</h2>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio (USD)</th>
            <th>Cambio 24h</th>
            <th>Capitalización</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto, index) => (
            <tr key={crypto.id}>
              <td>{index + 1}</td>
              <td>
                <img src={crypto.image} alt={crypto.name} width="20" />
                {crypto.name} <span>({crypto.symbol.toUpperCase()})</span>
              </td>
              <td>${crypto.current_price.toLocaleString()}</td>
              <td className={crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${crypto.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
    
  );
};

export default PageStar;