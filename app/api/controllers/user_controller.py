from api.models.user import User
from api import db
from sqlalchemy.sql.expression import or_

def signup(firstname, lastname, username, email, password):
    # Create a newUser
    newUser = User(firstname, lastname, username, email, password)
    # Check if existing users with same username/email
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
    # PasswordType's __eq__ function handles hash check
    if user and user.password == password:
        return "success"
    else:
        return "error"
