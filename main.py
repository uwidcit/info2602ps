import json
from flask import Flask, request
from flask_jwt import JWT, jwt_required, current_identity
from sqlalchemy.exc import IntegrityError
from datetime import timedelta
from flask_cors import CORS

from models import db, User, Book, myBooks

''' Begin boilerplate code '''
def create_app():
  app = Flask(__name__, static_url_path='')
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
  app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
  app.config['SECRET_KEY'] = "MYSECRET"
  CORS(app)
  db.init_app(app)
  return app

app = create_app()

app.app_context().push()

''' End Boilerplate Code '''

''' Set up JWT here '''
def authenticate(uname, password):
  #search for the specified user
  user = User.query.filter_by(username=uname).first()
  #if user is found and password matches
  if user and user.check_password(password):
    return user

#Payload is a dictionary which is passed to the function by Flask JWT
def identity(payload):
  return User.query.get(payload['identity'])

jwt = JWT(app, authenticate, identity)

''' End JWT Setup '''

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/app')
def client_app():
  return app.send_static_file('app.html')

@app.route('/signup', methods=['POST'])
def signup():
  userdata = request.get_json() # get userdata
  newuser = User(username=userdata['username'], email=userdata['email']) # create user object
  newuser.set_password(userdata['password']) # set password
  try:
    db.session.add(newuser)
    db.session.commit() # save user
  except IntegrityError: # attempted to insert a duplicate user
    db.session.rollback()
    return 'username or email already exists' # error message
  return 'user created' # success

@app.route('/myBooks', methods=['POST'])
@jwt_required()
def create_my_Book():
  data= request.get_json()
  rec = myBooks(mbid=data["mbid"], id=current_identity.id,bid=data["bid"], name=data["name"], author=data["author"])
  db.session.add(rec)
  db.session.commit()
  return "Added", 201

@app.route('/book', methods=['GET'])
def get_Books():
  books= Book.query.all()
  books= [book.toDict() for book in Books]
  return json.dumps(books)

@app.route('/myBooks', methods=['GET'])
@jwt_required()
def get_my_books():
  queryset = myBooks.query.filter_by(id=current_identity.id).all()
  if queryset == None:
    return 'Invalid id or unauthorized'
  if len(queryset) == 0:
    return 'No Books stored'
  book = [book.toDict() for book in queryset]
  return json.dumps(book)

@app.route('/myBooks/<num>', methods=['GET'])
@jwt_required()
def get_my_books(num):
  num = int(num)
  queryset = myBooks.query.filter_by(id=current_identity.id).all()
  if queryset == None:
    return 'Invalid id or unauthorized'
  if len(queryset) == 0:
    return 'No Books stored'
  if num > len(queryset):
    return 'Invalid num specified'
  return json.dumps(queryset[num-1].toDict())

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080, debug=True)