import React, { useState, useEffect } from 'react';
import '../../styles/bolsaticker.css';

const BolsaTicker = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos iniciales (se usará si la API falla o durante la carga)
  const initialMarkets = [
    { symbol: '^GSPC', name: 'S&P 500', price: '4,500.00', change: '+0.50%' },
    { symbol: '^DJI', name: 'Dow Jones', price: '34,500.00', change: '+0.30%' },
    { symbol: '^IXIC', name: 'NASDAQ', price: '14,200.00', change: '+0.75%' },
    { symbol: '^FTSE', name: 'FTSE 100', price: '7,500.00', change: '-0.20%' },
    { symbol: '^N225', name: 'Nikkei 225', price: '32,800.00', change: '+1.20%' },
    { symbol: '^HSI', name: 'Hang Seng', price: '19,500.00', change: '-0.80%' },
    { symbol: '^GDAXI', name: 'DAX', price: '15,800.00', change: '+0.40%' },
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // API gratuita alternativa (Alpha Vantage requiere API key)
        // Esta es una solución temporal con datos mockeados
        // En producción, usa una API real como Alpha Vantage o Twelve Data
        const mockApiResponse = {
          data: initialMarkets.map(item => ({
            ...item,
            price: (Math.random() * 10000 + 10000).toFixed(2),
            change: `${(Math.random() > 0.5 ? '+' : '')}${(Math.random() * 2).toFixed(2)}%`
          }))
        };

        // Simular retraso de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMarketData(mockApiResponse.data);
        setLoading(false);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar datos en tiempo real");
        setMarketData(initialMarkets); // Usar datos iniciales como fallback
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Actualizar cada 5 minutos (300000 ms)
    const interval = setInterval(fetchMarketData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker-container">
      <div className="ticker-label">Mercados:</div>
      <div className="ticker-wrap">
        <div className={`ticker ${loading ? 'loading' : ''}`}>
          {loading ? (
            <div className="ticker-item">Cargando datos de mercados...</div>
          ) : error ? (
            <div className="ticker-item error">{error}</div>
          ) : (
            marketData.map((market, index) => (
              <div key={index} className="ticker-item">
                <span className="market-name">{market.name}</span>
                <span className="market-price">{market.price}</span>
                <span className={`market-change ${market.change.startsWith('+') ? 'up' : 'down'}`}>
                  {market.change}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BolsaTicker;