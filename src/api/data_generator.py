# data_generator.py
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_fake_stock_data(company_name, start_price=100, days=1000):
    """Genera datos de acciones simulados con tendencia, estacionalidad y ruido"""
    np.random.seed(42)
    
    dates = pd.date_range(end=datetime.today(), periods=days)
    
    # Componentes de la serie temporal
    trend = np.linspace(0, np.random.normal(0, 2), days)
    seasonality = 15 * np.sin(np.linspace(0, 20*np.pi, days))
    noise = np.random.normal(0, 3, days)
    
    close_prices = start_price + trend + seasonality + noise
    close_prices = np.abs(close_prices)  # Precios no negativos
    
    df = pd.DataFrame({
        'date': dates,
        'open': close_prices * np.random.uniform(0.98, 1.02, days),
        'high': close_prices * np.random.uniform(1.01, 1.05, days),
        'low': close_prices * np.random.uniform(0.95, 0.99, days),
        'close': close_prices,
        'volume': np.random.lognormal(6, 0.5, days).astype(int),
        'company': company_name
    })
    
    return df

# Generar datos para 3 empresas ficticias
companies = {
    'TechFic Inc.': 150,
    'GreenEnergy Corp': 80,
    'HealthPlus Ltd': 200
}

all_data = pd.concat([generate_fake_stock_data(name, price) 
                     for name, price in companies.items()])
all_data.to_csv('fake_stocks.csv', index=False)