from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)

    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        self.clave = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.clave, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
class News(db.Model):
    __tablename__ = 'news'
    id=db.Column(db.String(120),primary_key=True, unique=True, nullable=False)
    title=db.Column(db.String(120), unique=False)
    urlToImage=db.Column(db.String(120), unique=True)

    def serialize(self):
        return{
            "id":self.id,
            "title":self.title,
            "urlToImage":self.urlToImage
        }
    
# class CryptoPrice(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     currency = db.Column(db.String(10), nullable=False)
#     price = db.Column(db.Float, nullable=False)
#     timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'currency': self.currency,
#             'price': self.price,
#             'timestamp': self.timestamp.isoformat()
#         }

class CryptoPrice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    currency = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    is_prediction = db.Column(db.Boolean, default=False)  # Añade este campo
    
    def __repr__(self):
        return f'<CryptoPrice {self.currency} {self.price} {self.timestamp}>'