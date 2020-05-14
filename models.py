from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class myBooks(db.Model):
  mbid= db.Column('bid', db.Integer, primary_key= True)
  id= db.Column('id', db.Integer, db.ForeignKey('user.id'))
  bid= db.Column('code', db.String(10), db.ForeignKey('Book.bid'))
  name= db.column(db.String(80), nullable= False)
  author= db.column(db.String(80))
  books= db.relationship('Book')

def toDict(self):
  return{
    "name": self.name,
    "author": self.author
  }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def toDict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password
        }

    # hashes the password parameter and stores it in the object
    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')

    # Returns true if the parameter is equal to the object's password property
    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    # To String method
    def __repr__(self):
        return '<User {}>'.format(self.username)


class Book(db.Model):
  bid= db.Column(db.Integer(10), primary_key= True)
  title= db.Column(db.String(80), nullable= False)
  author= db.Column(db.String(80), nullable= False)
  category= db.Column(db.String(80), nullable=False)
  description= db.Column(db.String(250), nullable=False)
  publishedDate= db.Column(db.String(4), nullable=False)
  publisher= db.Column(db.String(100), nullable=False)

  def toDict(self):
    return{
      "bid": self.bid,
      "title": self.tile,
      "author": self.author,
      "category": self.category,
      "description": self.description,
      "publisher": self.publisher
    }