from api.models.user import User
from api import db

def signup(firstname, lastname, username, email, password):
    newUser = User(firstname, lastname, username, email, password)
    if User.query.filter_by(username = newUser.username).first() is None:
        if User.query.filter_by(email = newUser.email).first() is None:
            db.session.add(newUser)
            db.session.commit()
        else:
            return "Error: email already exists."
    else:
        return "Error: username already exists."

def signin(name, password):
    user = User.query.filter_by(username = name).first()
    if user and user.password == password:
        return "success"
    else:
        return "error"
