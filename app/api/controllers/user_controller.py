from api.models.user import User
from api import db
from sqlalchemy.sql.expression import or_

def signup(firstname, lastname, username, email, password):
    newUser = User(firstname, lastname, username, email, password)
    existingUser = User.query.filter(or_(User.username == newUser.username, User.email == newUser.email)).first()
    if not existingUser:
        db.session.add(newUser)
        db.session.commit()
    elif existingUser.username == username:
        return "Error: username already exists."
    else:
        return "Error: email already exists."

def signin(name, password):
    user = User.query.filter_by(username = name).first()
    if user and user.password == password:
        return "success"
    else:
        return "error"
