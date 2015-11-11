import json
from api import app
from api.controllers.user_controller import signup
from flask import request

@app.route('/', methods=['POST'])
def index():
    requiredfields = ["firstname", "lastname", "password", "netid", "email"]
    data = request.data
    body = json.loads(data)
    for field in requiredfields:
        if field not in body:
            return "Doesn't work"

    return "works " + body["firstname"]+ " " + body["password"]

app.run(host='0.0.0.0', port = 8000, debug = True)
