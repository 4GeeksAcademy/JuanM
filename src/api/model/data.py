import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_stock_data(company_name, days=365*5):
    """Genera datos de acciones simulados para una empresa ficticia"""
    np.random.seed(42)
    
    start_date = datetime.now() - timedelta(days=days)
    dates = pd.date_range(start_date, periods=days, freq='D')
    
    # Tendencia base + fluctuaciones estacionales + ruido
    base_price = np.random.uniform(50, 200)
    trend = np.linspace(0, np.random.normal(0, 0.5), days)
    seasonality = 10 * np.sin(np.linspace(0, 10*np.pi, days))
    noise = np.random.normal(0, 2, days)
    
    close_prices = base_price + 20*trend + seasonality + noise
    close_prices = np.abs(close_prices)  # Los precios no pueden ser negativos
    
    volumes = np.random.lognormal(6, 0.5, days).astype(int)
    
    df = pd.DataFrame({
        'Date': dates,
        'Open': close_prices * np.random.uniform(0.99, 1.01, days),
        'High': close_prices * np.random.uniform(1.01, 1.03, days),
        'Low': close_prices * np.random.uniform(0.97, 0.99, days),
        'Close': close_prices,
        'Volume': volumes,
        'Company': company_name
    })
    
    return df

# Ejemplo de uso
company_data = generate_stock_data("TechFic Inc.")
company_data.to_csv('stock_data.csv', index=False)