import React, { useState, useEffect } from 'react';
import '../../styles/historial.css';

const Historial = () => {
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('10');

  // Available cryptocurrencies with their CoinGecko IDs
  const availableCryptos = {
    bitcoin: { id: 'bitcoin', name: 'Bitcoin (BTC)', color: '#f7931a' },
    ethereum: { id: 'ethereum', name: 'Ethereum (ETH)', color: '#627eea' },
    cardano: { id: 'cardano', name: 'Cardano (ADA)', color: '#0033ad' },
    solana: { id: 'solana', name: 'Solana (SOL)', color: '#00ffbd' }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cryptoId = availableCryptos[selectedCrypto].id;
        
        // Fetch historical data from CoinGecko API
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${timeRange}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();

        console.log( "esta es la data de historial que viene de la API", data)
        
        // Process the data to get prices for the last X days
        const prices = data.prices.map(entry => entry[1]);
        
        setCryptoData({
          ...availableCryptos[selectedCrypto],
          prices: prices
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCrypto, timeRange]);

  if (loading) return <div className="crypto-chart-container">Loading...</div>;
  if (error) return <div className="crypto-chart-container">Error: {error}</div>;
  if (!cryptoData) return <div className="crypto-chart-container">No data available</div>;

  const currentData = cryptoData;
  const minPrice = Math.min(...currentData.prices);
  const maxPrice = Math.max(...currentData.prices);
  const priceRange = maxPrice - minPrice;

  // Calculate coordinates for SVG chart (price higher at top)
  const getSvgY = (price) => {
    const chartHeight = 100; // Using 100% of SVG height
    return 100 - ((price - minPrice) / priceRange) * chartHeight;
  };

  // Generate data for line chart
  const linePathData = currentData.prices.map((price, index) => {
    const x = (index / (currentData.prices.length - 1)) * 100;
    const y = getSvgY(price);
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join(' ');

  // Generate data for bar chart
  const barWidth = 80 / currentData.prices.length;

  // Calculate percentage change
  const priceChange = (
    ((currentData.prices[currentData.prices.length - 1] - currentData.prices[0]) / 
    currentData.prices[0]) * 100
  ).toFixed(2);

  // Generate time labels based on selected time range
  const timeLabels = Array.from({ length: currentData.prices.length }, (_, i) => `${i + 1}d`);

  return (
    <div className="crypto-chart-container">
      <div className="chart-controls">
        <select 
          value={selectedCrypto} 
          onChange={(e) => setSelectedCrypto(e.target.value)}
        >
          {Object.keys(availableCryptos).map(key => (
            <option key={key} value={key}>{availableCryptos[key].name}</option>
          ))}
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7">7 días</option>
          <option value="10">10 días</option>
          <option value="14">14 días</option>
          <option value="30">30 días</option>
        </select>

        <div className="chart-type-selector">
          <button 
            className={chartType === 'line' ? 'active' : ''}
            onClick={() => setChartType('line')}
          >
            Línea
          </button>
          <button 
            className={chartType === 'bar' ? 'active' : ''}
            onClick={() => setChartType('bar')}
          >
            Barras
          </button>
        </div>
      </div>

      <div className="chart-title">{currentData.name} - Últimos {timeRange} días</div>

      <div className="chart-wrapper">
        <svg viewBox="0 0 100 100" className="chart-grid">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line 
              key={`grid-y-${y}`}
              x1="0" y1={y} 
              x2="100" y2={y} 
              stroke="#2a2a3a" 
              strokeWidth="0.5"
            />
          ))}

          {/* Selected chart */}
          {chartType === 'line' ? (
            <path 
              d={linePathData} 
              fill="none" 
              stroke={currentData.color} 
              strokeWidth="1.5"
            />
          ) : (
            currentData.prices.map((price, index) => {
              const x = (index / currentData.prices.length) * 100 + barWidth/2;
              const height = ((price - minPrice) / priceRange) * 100;
              return (
                <rect
                  key={`bar-${index}`}
                  x={x}
                  y={100 - height}  // Adjusted to grow from bottom
                  width={barWidth}
                  height={height}
                  fill={currentData.color}
                />
              );
            })
          )}

          {/* Points on line chart */}
          {chartType === 'line' && currentData.prices.map((price, index) => {
            const x = (index / (currentData.prices.length - 1)) * 100;
            const y = getSvgY(price);
            return (
              <circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r="1"
                fill={currentData.color}
              />
            );
          })}
        </svg>

        <div className="chart-labels-x">
          {timeLabels.map((label, index) => (
            <span key={`label-x-${index}`} style={{
              left: `${(index / (timeLabels.length - 1)) * 100}%`
            }}>
              {label}
            </span>
          ))}
        </div>

        <div className="chart-labels-y">
          <span style={{ bottom: '100%' }}>${maxPrice.toLocaleString()}</span>
          <span style={{ bottom: '50%' }}>${((maxPrice + minPrice) / 2).toLocaleString()}</span>
          <span style={{ bottom: '0%' }}>${minPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="price-change">
        Cambio: {priceChange}%
      </div>
    </div>
  );
};

export default Historial;