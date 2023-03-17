from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, auth_token_required,login_user,logout_user,current_user,roles_required
import cv2
import random, string
import numpy as np

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///faces.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'omgsuchastrongkeykdngeodjgnnr23'
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = "auth-tok"

db = SQLAlchemy(app)
db.init_app(app)
app.app_context().push()

roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer,autoincrement=True, primary_key=True)
    phone_num = db.Column(db.String(10), unique=True)
    address = db.Column(db.String(255))
    gender = db.Column(db.String(255))
    blood_group = db.Column(db.String(255))
    name = db.Column(db.String(255))
    face = db.Column(db.LargeBinary, nullable=False)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier=db.Column(db.String(255))
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
    
    def __init__(self,**kwargs) -> None:
        self.__dict__.update(kwargs)

    
    def get_id(self):
        return str(self.id)


face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

db.create_all()
api = Api(app)

class register(Resource):
    def post(self):
        phone_num = request.form['phone_num']
        address= request.form['address']
        gender= request.form['gender']
        blood_group= request.form['blood_group']
        name = request.form['name']
        img_file = request.files['image']
        password= request.form['password']
        active = True
        fs_uniquifier = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        img = cv2.imdecode(np.frombuffer(img_file.read(), np.uint8), cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces_rect = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        if len(faces_rect) == 0:
            return {'error':'no faces detected'},400
        if len(faces_rect) > 1:
            return {'error':'more than one face'},401

        x, y, w, h = faces_rect[0]
        face = gray[y:y+h, x:x+w]
        face = cv2.resize(face, (100, 100))
        user = User(phone_num=phone_num,address=address,gender=gender,blood_group=blood_group,name=name,face=face,password=password,active=active,fs_uniquifier=fs_uniquifier)
        
        db.session.add(user)
        db.session.commit()

api.add_resource(register,'/register')

if __name__ == '__main__':
    app.run(debug=True)
