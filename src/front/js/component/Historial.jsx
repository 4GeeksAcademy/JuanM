import React, { useState } from 'react';
import '../../styles/historial.css';

const Historial = () => {
  // Datos hardcodeados para diferentes criptomonedas
  const cryptoData = {
    bitcoin: {
      name: 'Bitcoin (BTC)',
      prices: [42000, 43500, 42800, 44000, 45500, 44200, 44800, 46000, 45800, 47000],
      color: '#f7931a'
    },
    ethereum: {
      name: 'Ethereum (ETH)',
      prices: [2200, 2400, 2350, 2500, 2450, 2600, 2550, 2700, 2650, 2800],
      color: '#627eea'
    },
    cardano: {
      name: 'Cardano (ADA)',
      prices: [1.2, 1.3, 1.25, 1.35, 1.4, 1.38, 1.45, 1.5, 1.48, 1.55],
      color: '#0033ad'
    },
    solana: {
      name: 'Solana (SOL)',
      prices: [90, 95, 92, 100, 105, 102, 110, 115, 112, 120],
      color: '#00ffbd'
    }
  };

  const timeLabels = ['1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d'];

  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [chartType, setChartType] = useState('line');

  const currentData = cryptoData[selectedCrypto];
  const minPrice = Math.min(...currentData.prices);
  const maxPrice = Math.max(...currentData.prices);
  const priceRange = maxPrice - minPrice;

  // Calcular coordenadas para el gráfico SVG
  const getSvgY = (price) => {
    const chartHeight = 200;
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  // Generar datos para el gráfico de líneas
  const linePathData = currentData.prices.map((price, index) => {
    const x = (index / (currentData.prices.length - 1)) * 100;
    const y = getSvgY(price);
    return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
  }).join(' ');

  // Generar datos para el gráfico de barras
  const barWidth = 80 / currentData.prices.length;

  // Calcular el cambio porcentual
  const priceChange = (
    ((currentData.prices[currentData.prices.length - 1] - currentData.prices[0]) / 
    currentData.prices[0] * 100
  ).toFixed(2));

  return (
    <div className="crypto-chart-container">
      <div className="chart-controls">
        <select 
          value={selectedCrypto} 
          onChange={(e) => setSelectedCrypto(e.target.value)}
        >
          {Object.keys(cryptoData).map(key => (
            <option key={key} value={key}>{cryptoData[key].name}</option>
          ))}
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

      <div className="chart-title">{currentData.name} - Últimos 10 días</div>

      <div className="chart-wrapper">
        <svg viewBox="0 0 100 100" className="chart-grid">
          {/* Líneas de la cuadrícula */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line 
              key={`grid-y-${y}`}
              x1="0" y1={y} 
              x2="100" y2={y} 
              stroke="#2a2a3a" 
              strokeWidth="0.5"
            />
          ))}

          {/* Gráfico seleccionado */}
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
                  y={100 - height}
                  width={barWidth}
                  height={height}
                  fill={currentData.color}
                />
              );
            })
          )}

          {/* Puntos en el gráfico de líneas */}
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
          <span style={{ bottom: '0%' }}>${minPrice.toLocaleString()}</span>
          <span style={{ bottom: '50%' }}>${((maxPrice + minPrice) / 2).toLocaleString()}</span>
          <span style={{ bottom: '100%' }}>${maxPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="price-change">
        Cambio: {priceChange}%
      </div>
    </div>
  );
};

export default Historial;