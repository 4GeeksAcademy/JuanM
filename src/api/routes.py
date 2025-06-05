from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, News,  CryptoPrice
from datetime import timedelta, datetime
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import re 
import requests
import datetime
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from flask_cors import cross_origin


api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)

# model = MLModel()
API_URL = "https://miniature-xylophone-56p4j4jj4p7h74pj-3001.app.github.dev/api/history"

# 1.- Prueba
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200

# 2.- Ruta para obtener los datos de los usuarios registrados (corregida la ruta)
@api.route('/users', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

def is_valid_email(email):
    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    return re.match(regex, email)


# GET: /users/<int:idUsuario>
@api.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.filter_by(id=id).first()
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404	
    return jsonify(user.serialize())

# 3) Ruta para crear un nuevo usuario
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json() 

    # Validar que se recibieron email y password
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email y password son requeridos'}), 401
    
    email = data['email'].strip().lower()
    password = data['password']

    # Validar formato de email
    if not is_valid_email(email):
        return jsonify({'error': 'Formato de email inválido'}), 402
    
    # Validar que el password tenga al menos 6 caracteres
    if len(password) < 6:
        return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 403
    
    # Verificar si el usuario ya existe
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    # Crear nuevo usuario
    try:
        new_user = User(email=email, password=password)  # En producción, hashear la contraseña!
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'user': new_user.serialize()  # Usamos el método serialize
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error al registrar el usuario: {str(e)}'}), 500
    
# 4) Ruta para loguear un nuevo usuario

@api.route ('/login', methods=['POST'])
def login_user():

    data=request.get_json()
    if not data:
        return jsonify ({'msg': 'No se recibieron datos'}), 400
    
    print("Datos recibidos:", data)
    
    required_fields = ['email', 'password']

   # Verifica campos obligatorios
    if 'email' not in data or 'password' not in data:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 401  # 401 = Unauthorized
    
    # user = User.query.filter_by(email= data.get("email"), password = data.get("password")).first()
    user = User.query.filter_by(email=data['email']).first()

    if user is None:
        # Usuario no encontrad
        return jsonify({"msg": "Error en el nombre de Usuario o en la clave de acceso"}), 402
    
  # Crea el token de acceso JWT
    access_token = create_access_token(
        identity=user.email,
        expires_delta=timedelta(hours=1),

    ) 
    return jsonify({ "msg" : "Acceso otorgado al usuario: " +  user.email ,
                    "token": access_token,
                    "id":user.id,
                    "email":user.email
                      }), 200


# DELETE: /users/<int:id>
@api.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    # Verificar si tiene reservas
    
    # Eliminar el usuario y sus relaciones
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'msg': 'Usuario eliminado exitosamente'}), 200



@api.route('/news', methods=['GET'])
def list_news():
    try:
        # Configuración de la API externa 
        api_key = '7b9f682164a2430a90dd666dfe5b6a8a'  
        url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
        
        # Hacer la solicitud a la API externa
        response = requests.get(url)
        response.raise_for_status()  
        
        # Procesar la respuesta
        data = response.json()
        articles = data.get('articles', [])
        
        # Formatear la respuesta (puedes ajustar esto según lo que necesites)
        formatted_news = [{
            'title': article['title'],
            'description': article.get('description', ''),
            'url': article['url'],
            'publishedAt': article['publishedAt'],
            'source': article['source']['name']
        } for article in articles]

        # formatted_news = News.query.all()
        # return jsonify([formatted_news.serialize() for user in formatted_news]), 200
        
        return jsonify(formatted_news), 200
    
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Error al procesar las noticias'}), 500
    

@api.route('/history', methods=['GET'])
def get_crypto_history():
    try:
        # Parámetros de la solicitud
        crypto_id = request.args.get('id', 'bitcoin')  
        days = request.args.get('days', '30')          
        currency = request.args.get('currency', 'usd') 

        # Configuración de la API de CoinGecko
        url = f'https://api.coingecko.com/api/v3/coins/{crypto_id}/market_chart'
        params = {
            'vs_currency': currency,
            'days': days
        }
    
        # Hacer la solicitud a la API
        response = requests.get(url, params=params)
        response.raise_for_status()  # Lanza excepción para errores HTTP
        
        # Procesar la respuesta
        data = response.json()
        
        # Formatear los datos para respuesta
        price_history = [{
            'timestamp': point[0],
            'price': point[1]
        } for point in data['prices']]

        return jsonify({
            'crypto_id': crypto_id,
            'price': currency,
            'timeframe_days': days,
            'history': price_history
        }), 200

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
    

@api.route('/password', methods=['PUT'])
@jwt_required()
def change_password():
    try:
        data = request.get_json()
        
        # Debug: Imprime los datos recibidos
        print("Datos recibidos:", data)
        
        if not data or 'current_password' not in data or 'new_password' not in data:
            return jsonify({"error": "Se requieren current_password y new_password"}), 400

        email = get_jwt_identity()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Debug: Verifica valores antes de comparar
        print(f"Comparando contraseña para usuario: {email}")
        print(f"Hash almacenado: {user.password}")
        print(f"Contraseña recibida: {data['current_password']}")

        # Verificación mejorada
        if not user.check_password(data['current_password']):
            print("¡La contraseña NO coincide!")
            return jsonify({"error": "Contraseña actual incorrecta"}), 401
        else:
            print("Contraseña verificada correctamente")

        # Validar la nueva contraseña
        if len(data['new_password']) < 8:
            return jsonify({"error": "La nueva contraseña debe tener al menos 8 caracteres"}), 400

        # Actualizar la contraseña
        user.set_password(data['new_password'])
        db.session.commit()

        return jsonify({"message": "Contraseña actualizada exitosamente"}), 200

    except Exception as e:
        print("Error completo:", str(e))
        return jsonify({"error": str(e)}), 500















    








      
 