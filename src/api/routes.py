from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, News
from datetime import timedelta
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import re 
import requests



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

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
                    "email":user.email
                      }), 200


@api.route('/news', methods=['GET'])
def list_news():
    try:
        # Configuración de la API externa (ejemplo con NewsAPI)
        api_key = '7b9f682164a2430a90dd666dfe5b6a8a'  # Reemplaza con tu API key real
        url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}'
        
        # Hacer la solicitud a la API externa
        response = requests.get(url)
        response.raise_for_status()  # Lanza excepción para errores HTTP
        
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
        
        return jsonify(formatted_news), 200
    
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Error al procesar las noticias'}), 500






      
 