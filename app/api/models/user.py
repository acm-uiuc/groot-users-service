from base import Base
from api import db
from sqlalchemy_utils.types.password import PasswordType
class User(Base):
    __tablename__ = 'auth_user'
    firstname= db.Column(db.String(80))
    lastname= db.Column(db.String(80))
    email = db.Column(db.String(120), unique=True)
    netid = db.Column(db.String(120), unique=True)
    # The PasswordType type implements passlib to securely hash passwords
    # Current scheme is sha512, but can be changed easily.
    password = db.Column(PasswordType(
        schemes = [
            'pbkdf2_sha512'
        ]))

    def __init__(self, firstname, lastname, username, email, netid, password):
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.email = email
        self.netid = netid
        self.password = password

    def __repr__(self):
        return '<User %r>' %self.username
