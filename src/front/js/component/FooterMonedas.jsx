import React, { useState, useEffect } from 'react';
import '../../styles/footermonedas.css';

const FooterMonedas = () => {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState('USD');

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // Usando ExchangeRate-API (requiere API key gratuita)
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/TU_API_KEY/latest/${baseCurrency}`
          // Alternativa sin API key (puede tener limitaciones):
          // `https://api.exchangerate.host/latest?base=${baseCurrency}`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener tasas de cambio');
        }
        
        const data = await response.json();
        if (data.result === 'error') {
          throw new Error(data['error-type']);
        }
        
        setExchangeRates(data.conversion_rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();

    // Actualizar cada hora (las APIs fiat no necesitan actualización tan frecuente)
    const interval = setInterval(fetchExchangeRates, 3600000);
    
    return () => clearInterval(interval);
  }, [baseCurrency]);

  // Monedas populares a mostrar
  const popularCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'MXN', 'BRL', 'ARS', 'CLP'];

  return (
    <footer className="fiat-footer">
      <div className="footer-container">
        <div className="currency-selector">
          <label>Mostrar valores en: </label>
          <select 
            value={baseCurrency} 
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            <option value="USD">Dólar Estadounidense (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">Libra Esterlina (GBP)</option>
          </select>
        </div>
        
        <h3 className="footer-title">Tasas de Cambio ({baseCurrency})</h3>
        
        {loading ? (
          <div className="loading">Cargando tasas de cambio...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="currency-grid">
            {popularCurrencies.map((currency) => (
              exchangeRates[currency] && (
                <div key={currency} className="currency-item">
                  <span className="currency-flag">{getCurrencyFlag(currency)}</span>
                  <span className="currency-code">{currency}</span>
                  <span className="currency-rate">
                    {exchangeRates[currency].toFixed(4)}
                  </span>
                </div>
              )
            ))}
          </div>
        )}
        
        <div className="footer-disclaimer">
          <p>Datos proporcionados por ExchangeRate API. Actualizado cada hora.</p>
          <p>© {new Date().getFullYear()} Tu App Financiera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

// Función para mostrar banderas (simplificada)
const getCurrencyFlag = (currency) => {
  const flags = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    CNY: '🇨🇳',
    MXN: '🇲🇽',
    BRL: '🇧🇷',
    ARS: '🇦🇷',
    CLP: '🇨🇱'
  };
  return flags[currency] || currency;
};

export default FooterMonedas;