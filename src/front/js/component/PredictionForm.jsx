import React from 'react';

function PredictionForm({ currency, setCurrency, onPredict, loading }) {
  return (
    <div className="form-container">
      <select 
        value={currency} 
        onChange={(e) => setCurrency(e.target.value)}
        disabled={loading}
      >
        <option value="BTC">Bitcoin (BTC)</option>
        {/* <option value="ETH">Ethereum (ETH)</option>
        <option value="SOL">Solana (SOL)</option> */}
      </select>
      
      <button 
        onClick={onPredict} 
        disabled={loading}
      >
        {loading ? 'Predicting...' : 'Predict Prices'}
      </button>
    </div>
  );
}

export default PredictionForm;