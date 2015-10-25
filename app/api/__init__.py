from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'

#Turn off warnings.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
db.create_all()

#Test signup and signin
from controllers.user_controller import signup
from controllers.user_controller import signin

a = signup("Test","Tester", "tests4dayz", "tester@test.test", "testpw")
if a is None:
    print "signup success"
b = signin("tests4dayz", "testpw")
if b is "success":
    print "signin success"
