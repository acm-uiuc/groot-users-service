from api import db

#import any models to make database aware of necessary tables
from api.models import User

#create all tables
db.create_all()
