import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import models

load_dotenv()
app = Flask(__name__)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")

db = SQLAlchemy(app)

@app.route("/")
def hello():
    return "Hello. This works"

@app.route("/user/<first_name>/<last_name>")
def createUser(first_name, last_name):
    user = models.TechsuiteUser(first_name=first_name, last_name=last_name)
    db.session.add(user)
    db.session.commit()
    return "Added a user"

@app.route("/channel/<name>")
def createChannel(name):
    channel = models.Channel(name=name)
    db.session.add(channel)
    db.session.commit()
    return "Added a channel"

@app.route("/getuser/<first_name>")
def get_user(first_name):
    user = models.TechsuiteUser.query.filter_by(first_name=first_name).first()
    return "Found: {}".format(user)

@app.route("/allusers")
def get_all_users():
    users = models.TechsuiteUser.query.all()
    result = ""
    for eachUser in users:
        result += "{}\n".format(eachUser.first_name)
    return result

if __name__ == '__main__':
    app.run(port=6969, debug=True)
    