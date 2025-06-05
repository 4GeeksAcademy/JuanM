// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../../styles/stockmarkets.css';

// const StockMarkets = () => {
//   const [markets, setMarkets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('all');

//   // Símbolos de los principales índices bursátiles
//   const marketSymbols = [
//     { symbol: '^GSPC', name: 'S&P 500 (EE.UU.)' },
//     { symbol: '^DJI', name: 'Dow Jones (EE.UU.)' },
//     { symbol: '^IXIC', name: 'NASDAQ (EE.UU.)' },
//     { symbol: '^FTSE', name: 'FTSE 100 (Reino Unido)' },
//     { symbol: '^GDAXI', name: 'DAX (Alemania)' },
//     { symbol: '^FCHI', name: 'CAC 40 (Francia)' },
//     { symbol: '^N225', name: 'Nikkei 225 (Japón)' },
//     { symbol: '^HSI', name: 'Hang Seng (Hong Kong)' },
//     { symbol: '^AXJO', name: 'S&P/ASX 200 (Australia)' }
//   ];

//   useEffect(() => {
//     const fetchMarketData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Opción 1: Usar un proxy CORS
//         const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//         const apiUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${marketSymbols.map(m => m.symbol).join(',')}`;
        
//         // Opción 2: Usar un backend propio (recomendado para producción)
//         // const apiUrl = '/api/markets'; // Endpoint en tu backend

//         const response = await axios.get(proxyUrl + apiUrl, {
//           headers: {
//             'X-Requested-With': 'XMLHttpRequest'
//           }
//         });
        
//         const marketData = response.data.quoteResponse.result.map(item => {
//           const marketInfo = marketSymbols.find(m => m.symbol === item.symbol);
//           return {
//             symbol: item.symbol,
//             name: marketInfo?.name || item.symbol,
//             price: item.regularMarketPrice,
//             change: item.regularMarketChange,
//             changePercent: item.regularMarketChangePercent,
//             dayHigh: item.regularMarketDayHigh,
//             dayLow: item.regularMarketDayLow
//           };
//         });
        
//         setMarkets(marketData);
//       } catch (err) {
//         setError(`Error al obtener datos: ${err.message}. Intenta recargar la página.`);
//         // Datos de ejemplo en caso de error
//         setMarkets(marketSymbols.map(market => ({
//           ...market,
//           price: Math.random() * 10000 + 1000,
//           change: (Math.random() * 200 - 100),
//           changePercent: (Math.random() * 5 - 2.5),
//           dayHigh: Math.random() * 100 + 1000,
//           dayLow: Math.random() * 100 + 900
//         })));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMarketData();
    
//     const interval = setInterval(fetchMarketData, 300000); // Actualizar cada 5 minutos
    
//     return () => clearInterval(interval);
//   }, []);

//   const filteredMarkets = filter === 'all' 
//     ? markets 
//     : filter === 'up'
//       ? markets.filter(market => market.change > 0)
//       : markets.filter(market => market.change < 0);

//   if (loading) return <div className="loading">Cargando datos de mercados...</div>;

//   return (
//     <div className="stock-markets-container">
//       <h2>Principales Bolsas del Mundo</h2>
      
//       {error && (
//         <div className="error-warning">
//           <div className="error">{error}</div>
//           <small>Mostrando datos de ejemplo</small>
//         </div>
//       )}
      
//       <div className="market-controls">
//         <div className="market-filters">
//           <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
//             Todos
//           </button>
//           <button onClick={() => setFilter('up')} className={filter === 'up' ? 'active' : ''}>
//             Al alza
//           </button>
//           <button onClick={() => setFilter('down')} className={filter === 'down' ? 'active' : ''}>
//             A la baja
//           </button>
//         </div>
        
//         <button 
//           className="refresh-button"
//           onClick={() => window.location.reload()}
//         >
//           ↻ Recargar
//         </button>
//       </div>
      
//       <div className="markets-grid">
//         {filteredMarkets.map((market) => (
//           <MarketCard key={market.symbol} market={market} />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Componente MarketCard separado para mejor legibilidad
// const MarketCard = ({ market }) => (
//   <div className="market-card">
//     <div className="market-header">
//       <h3>{market.name}</h3>
//       <span className="market-symbol">{market.symbol}</span>
//     </div>
    
//     <div className="market-price-data">
//       <div className="price-main">
//         <span className="price">${market.price.toFixed(2)}</span>
//         <span className={`change ${market.change > 0 ? 'positive' : 'negative'}`}>
//           {market.change > 0 ? '↑' : '↓'} {market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)
//         </span>
//       </div>
      
//       <div className="price-range">
//         <div className="range-item">
//           <span className="range-label">Máx:</span>
//           <span className="range-value">${market.dayHigh?.toFixed(2) || 'N/A'}</span>
//         </div>
//         <div className="range-item">
//           <span className="range-label">Mín:</span>
//           <span className="range-value">${market.dayLow?.toFixed(2) || 'N/A'}</span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default StockMarkets;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/stockmarkets.css';

const StockMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Símbolos de los principales índices bursátiles en Marketstack
  const marketSymbols = [
    { symbol: 'IXIC', name: 'NASDAQ (EE.UU.)' },
    { symbol: 'DJI', name: 'Dow Jones (EE.UU.)' },
    { symbol: 'GSPC', name: 'S&P 500 (EE.UU.)' },
    { symbol: 'FTSE', name: 'FTSE 100 (Reino Unido)' },
    { symbol: 'GDAXI', name: 'DAX (Alemania)' },
    { symbol: 'FCHI', name: 'CAC 40 (Francia)' },
    { symbol: 'N225', name: 'Nikkei 225 (Japón)' },
    { symbol: 'HSI', name: 'Hang Seng (Hong Kong)' },
    { symbol: 'AXJO', name: 'S&P/ASX 200 (Australia)' }
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Configuración de la API de Marketstack
      //   const API_KEY = '654e384ff0c900008e3d44048f9c640f'; // Reemplaza con tu API key
      //   const symbols = marketSymbols.map(m => m.symbol).join(',');
      //   const apiUrl = `https://api.marketstack.com/v1/intraday/latest?access_key=${API_KEY}&symbols=${symbols}`;
        
      //   const response = await axios.get(apiUrl);

      //   console.log('Respuesta completa:', error.response);

        
      //   if (response.data.error) {
      //     throw new Error(response.data.error.message);
      //   }

 
        
      //   const marketData = response.data.data.map(item => {
      //     const marketInfo = marketSymbols.find(m => m.symbol === item.symbol);
      //     return {
      //       symbol: item.symbol,
      //       name: marketInfo?.name || item.symbol,
      //       price: item.last,
      //       change: item.change,
      //       changePercent: item.change_percent,
      //       dayHigh: item.high,
      //       dayLow: item.low
      //     };
      //   });
        
      //   setMarkets(marketData);
      // } catch (err) {
      //   setError(`Error al obtener datos: ${err.message}. Intenta recargar la página.`);
        // Datos de ejemplo en caso de error
        setMarkets(marketSymbols.map(market => ({
          ...market,
          price: Math.random() * 10000 + 1000,
          change: (Math.random() * 200 - 100),
          changePercent: (Math.random() * 5 - 2.5),
          dayHigh: Math.random() * 100 + 1000,
          dayLow: Math.random() * 100 + 900
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    const interval = setInterval(fetchMarketData, 300000); // Actualizar cada 5 minutos
    
    return () => clearInterval(interval);
  }, []);

  const filteredMarkets = filter === 'all' 
    ? markets 
    : filter === 'up'
      ? markets.filter(market => market.change > 0)
      : markets.filter(market => market.change < 0);

  if (loading) return <div className="loading">Cargando datos de mercados...</div>;

  return (
    <div className="stock-markets-container">
      <h2>Principales Bolsas del Mundo</h2>
      
      {error && (
        <div className="error-warning">
          <div className="error">{error}</div>
          <small>Mostrando datos de ejemplo</small>
        </div>
      )}
      
      <div className="market-controls">
        <div className="market-filters">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            Todos
          </button>
          <button onClick={() => setFilter('up')} className={filter === 'up' ? 'active' : ''}>
            Al alza
          </button>
          <button onClick={() => setFilter('down')} className={filter === 'down' ? 'active' : ''}>
            A la baja
          </button>
        </div>
        
        <button 
          className="refresh-button"
          onClick={() => window.location.reload()}
        >
          ↻ Recargar
        </button>
      </div>
      
      <div className="markets-grid">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.symbol} market={market} />
        ))}
      </div>
    </div>
  );
};

// Componente MarketCard separado para mejor legibilidad
const MarketCard = ({ market }) => (
  <div className="market-card">
    <div className="market-header">
      <h3>{market.name}</h3>
      <span className="market-symbol">{market.symbol}</span>
    </div>
    
    <div className="market-price-data">
      <div className="price-main">
        <span className="price">${market.price?.toFixed(2) || 'N/A'}</span>
        {market.change !== undefined && market.changePercent !== undefined && (
          <span className={`change ${market.change > 0 ? 'positive' : 'negative'}`}>
            {market.change > 0 ? '↑' : '↓'} {market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)
          </span>
        )}
      </div>
      
      <div className="price-range">
        <div className="range-item">
          <span className="range-label">Máx:</span>
          <span className="range-value">${market.dayHigh?.toFixed(2) || 'N/A'}</span>
        </div>
        <div className="range-item">
          <span className="range-label">Mín:</span>
          <span className="range-value">${market.dayLow?.toFixed(2) || 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
);

export default StockMarkets;