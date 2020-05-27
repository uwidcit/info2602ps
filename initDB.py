from main import app
from models import db, User
#Copied from Lab 5
bob = User(username="bob", email="bob@mail.com") # creates an object from the User class/model
bob.set_password("bobpass") # use method to hash password
john = User(username="john", email="john@mail.com")
john.set_password('johnpass')

  
db.create_all(app=app)

print('database initialized!')