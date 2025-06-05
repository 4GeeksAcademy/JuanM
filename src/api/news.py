# from flask import Flask, request, jsonify, url_for, Blueprint
# from api.models import db, News
# from datetime import timedelta
# from api.utils import generate_sitemap, APIException
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# import re 

# api = Blueprint('api', __name__)

# # Allow CORS requests to this API
# CORS(api)

# #Ruta para obtener las noticias

# @api.route('/news', methods=['GET'])
# def list_users():
#     news = News.query.all()
#     return jsonify([news.serialize() for user in news]), 200

