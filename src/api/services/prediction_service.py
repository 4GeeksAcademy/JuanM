
# from api.model.prediction_model import MLModel
# from api.models import db, CryptoPrice
# import numpy as np
# from datetime import datetime, timedelta


# def train_and_predict(currency='BTC'):
#     predictor = MLModel()
    
#     # Obtener datos históricos reales
#     historical_data = CryptoPrice.query.filter_by(
#         currency=currency,
#         is_prediction=False  # Solo datos reales
#     ).order_by(
#         CryptoPrice.timestamp.asc()
#     ).all()
    
#     if len(historical_data) < 10:
#         raise ValueError(f"No hay suficientes datos históricos para {currency}")
    
#     # Preparar datos para entrenamiento
#     days = np.array([(data.timestamp - historical_data[0].timestamp).days + 1 
#                     for data in historical_data]).reshape(-1, 1)
#     prices = np.array([data.price for data in historical_data]).reshape(-1, 1)
    
#     # Entrenar modelo
#     predictor.train(days, prices)
    
#     # Predecir para los próximos 5 días
#     last_day = days[-1][0]
#     future_days = np.arange(last_day + 1, last_day + 6).reshape(-1, 1)
#     predicted_prices = predictor.predict(future_days)
    
#     # Guardar predicciones
#     today = datetime.now()
#     for i, price in enumerate(predicted_prices):
#         crypto_price = CryptoPrice(
#             currency=currency,
#             price=float(price),
#             timestamp=today + timedelta(days=i+1),
#             is_prediction=True  # Marcar como predicción
#         )
#         db.session.add(crypto_price)
    
#     db.session.commit()
    
#     return predicted_prices.flatten().tolist()

