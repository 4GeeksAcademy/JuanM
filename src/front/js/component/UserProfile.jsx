import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import '../../styles/userprofile.css';

const UserProfile = () => {

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly'); // monthly, quarterly, yearly
  const { actions } = useContext(Context);

   const currentUser = {
    displayName: "Juan Pérez",
    email: "juan@example.com",
    photoURL: "/default-avatar.png"
  };

  
  useEffect(() => {
    // Simulación de carga de datos desde una API
    const fetchInvestments = async () => {
      try {
        // Datos de ejemplo (reemplazar con llamada real a tu API)
        const mockInvestments = [
          { id: 1, name: 'Tech Stocks', amount: 5000, returns: 1200, date: '2023-10-15', type: 'stocks' },
          { id: 2, name: 'Real Estate', amount: 15000, returns: -500, date: '2023-09-20', type: 'property' },
          { id: 3, name: 'Crypto', amount: 3000, returns: 800, date: '2023-11-05', type: 'crypto' }
        ];
        
        setInvestments(mockInvestments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching investments:", error);
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Cálculo de métricas
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0);
  const profitLossPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0;

  // Filtrar por rango de tiempo
  const filteredInvestments = investments.filter(inv => {
    const invDate = new Date(inv.date);
    const now = new Date();
    
    if (timeRange === 'monthly') {
      return invDate.getMonth() === now.getMonth();
    } else if (timeRange === 'quarterly') {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      return invDate >= quarterStart;
    } else { // yearly
      return invDate.getFullYear() === now.getFullYear();
    }
  });

  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  return (
    <div className="user-profile-container">
      <header className="profile-header">
        <div className="user-info">
          <img 
            src={currentUser?.photoURL || '/default-avatar.png'} 
            alt="User Avatar" 
            className="user-avatar"
          />
          <h2>{currentUser?.displayName || 'Usuario'}</h2>
          <p className="user-email">{currentUser?.email}</p>
        </div>
      </header>

      <div className="financial-summary">
        <div className="summary-card">
          <h3>Inversión Total</h3>
          <p className="amount">${totalInvested.toLocaleString()}</p>
        </div>
        
        <div className={`summary-card ${totalReturns >= 0 ? 'positive' : 'negative'}`}>
          <h3>Ganancias/Pérdidas</h3>
          <p className="amount">
            {totalReturns >= 0 ? '+' : ''}${Math.abs(totalReturns).toLocaleString()}
            <span className="percentage"> ({profitLossPercentage}%)</span>
          </p>
        </div>
      </div>

      <div className="time-range-selector">
        <button 
          className={timeRange === 'monthly' ? 'active' : ''}
          onClick={() => setTimeRange('monthly')}
        >
          Mensual
        </button>
        <button 
          className={timeRange === 'quarterly' ? 'active' : ''}
          onClick={() => setTimeRange('quarterly')}
        >
          Trimestral
        </button>
        <button 
          className={timeRange === 'yearly' ? 'active' : ''}
          onClick={() => setTimeRange('yearly')}
        >
          Anual
        </button>
      </div>

      <div className="investments-list">
        <h3>Tus Inversiones ({filteredInvestments.length})</h3>
        
        {filteredInvestments.length > 0 ? (
          <ul>
            {filteredInvestments.map(investment => (
              <li key={investment.id} className="investment-item">
                <div className="investment-icon">
                  {investment.type === 'stocks' && '📈'}
                  {investment.type === 'property' && '🏠'}
                  {investment.type === 'crypto' && '🪙'}
                </div>
                <div className="investment-details">
                  <h4>{investment.name}</h4>
                  <p className="investment-date">
                    {new Date(investment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="investment-numbers">
                  <p className="investment-amount">${investment.amount.toLocaleString()}</p>
                  <p className={`investment-returns ${investment.returns >= 0 ? 'positive' : 'negative'}`}>
                    {investment.returns >= 0 ? '+' : ''}${Math.abs(investment.returns).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-investments">No hay inversiones en este período</p>
        )}
      </div>

      <div className="performance-chart">
        <h3>Rendimiento</h3>
        {/* Aquí iría un gráfico (usar Chart.js, Victory, etc.) */}
        <div className="chart-placeholder">
          [Gráfico de rendimiento por {timeRange}]
        </div>
      </div>
    </div>
  );
};

export default UserProfile;