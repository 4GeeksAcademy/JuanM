# model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error
import joblib
import pickle
import requests
import os
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from datetime import datetime

class BitcoinPredictor:
    def __init__(self):
        self.model = None
        self.data_file = 'data/historical_data.csv'
        self.model_file = 'data/model.pkl'
        
    def fetch_historical_data(self, days=365):
        """Obtiene datos históricos de CoinGecko API"""
        url = "https://miniature-xylophone-56p4j4jj4p7h74pj-3001.app.github.dev/api/history"
        params = {
            'vs_currency': 'usd',
            'days': days,
            'interval': 'daily'
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        # Procesar los datos
        prices = data['prices']
        df = pd.DataFrame(prices, columns=['timestamp', 'price'])
        df['date'] = pd.to_datetime(df['timestamp'], unit='ms')
        df = df.set_index('date')
        df = df[['price']]
        
        # Crear características (features)
        df['day'] = df.index.day
        df['month'] = df.index.month
        df['year'] = df.index.year
        df['day_of_week'] = df.index.dayofweek
        
        # Guardar datos
        os.makedirs('data', exist_ok=True)
        df.to_csv(self.data_file)
        
        return df
    
    def train_model(self, days=365):
        """Entrena el modelo de regresión lineal"""
        if not os.path.exists(self.data_file):
            self.fetch_historical_data(days)
            
        df = pd.read_csv(self.data_file, index_col='date', parse_dates=True)
        
        # Preparar datos
        X = df[['day', 'month', 'year', 'day_of_week']]
        y = df['price']
        
        # Dividir datos
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Entrenar modelo
        self.model = LinearRegression()
        self.model.fit(X_train, y_train)
        
        # Guardar modelo
        with open(self.model_file, 'wb') as f:
            pickle.dump(self.model, f)
            
        return self.model.score(X_test, y_test)  # Retorna el score R²
    
    def load_model(self):
        """Carga el modelo entrenado"""
        if os.path.exists(self.model_file):
            with open(self.model_file, 'rb') as f:
                self.model = pickle.load(f)
        else:
            self.train_model()
        return self.model
    
    def predict_price(self, date_str):
        """Predice el precio para una fecha específica"""
        if self.model is None:
            self.load_model()
            
        date = datetime.strptime(date_str, '%Y-%m-%d')
        features = {
            'day': [date.day],
            'month': [date.month],
            'year': [date.year],
            'day_of_week': [date.weekday()]
        }
        
        df = pd.DataFrame(features)
        prediction = self.model.predict(df)
        
        return prediction[0]