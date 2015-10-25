from base import Base
from api import db
from sqlalchemy_utils.types.password import PasswordType
class User(Base):
    __tablename__ = 'auth_user'
    firstname= db.Column(db.String(80))
    lastname= db.Column(db.String(80))
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(PasswordType(
        schemes = [
            'pbkdf2_sha512'
        ]))

    def __init__(self, firstname, lastname, username, email, password):
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.email = email
        self.password = password

    def __repr__(self):
        return '<User %r>' %self.username
