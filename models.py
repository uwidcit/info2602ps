from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
db = SQLAlchemy()
import datetime

# Code is copied from lab 5 and 6
class User(UserMixin, db.Model):
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
    
    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class UserReact(db.Model):
    userId = db.Column(db.Integer, db.ForeignKey('user.id'),  primary_key=True)
    postId = db.Column(db.Integer, db.ForeignKey('post.id') , nullable=False)
    react = db.Column(db.String(120), default= 'like' or 'dislike')


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False )
    text = db.Column(db.String(1200), nullable=False)
    reacts = db.relationship('UserReact', backref='Post', lazy=True, cascade="all, delete-orphan")

    def getTotalLikes(self):
        Likes = 0
        for react in self.reacts :
            if (react == "like"): Likes += 1
        return Likes    

    def getTotalDislikes(self):
        Dislikes = 0
        for react in self.reacts :
            if (react == "dislike"): Dislikes += 1
        return Dislikes

    def toDict(self):
        return {
        "postId": self.id,
        "userId": self.userId,
        "text": self.text,
        "reacts": self.reacts,
        "likes": self.getTotalLikes(),
        "dislikes":self.getTotalDislikes()
        
      }