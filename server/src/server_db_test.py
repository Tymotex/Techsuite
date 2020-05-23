from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = ""

db = SQLAlchemy(app)

# This class will map to a database table. Objects of this class will map to tuples of that table
class TechsuiteUser(db.Model):
    # Defining some attributes of this relation
    u_id = db.Column(db.Integer, primary_key=True)
    name_first = db.Column(db.String(50))
    name_last = db.Column(db.String(50))
    # Passing datetime.now as the callback function which is executed everytime a new record is added
    time_created = db.Column(db.DateTime, default=datetime.now)  

class Channel(db.Model):
    # Defining some attributes of this relation
    channel_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    # Passing datetime.now as the callback function which is executed everytime a new record is added
    # time_created = db.Column(db.DateTime, default=datetime.now)  

@app.route("/")
def hello():
    return "Hello. This works"


@app.route("/user/<name_first>/<name_last>")
def createUser(name_first, name_last):
    user = TechsuiteUser(name_first=name_first, name_last=name_last)
    db.session.add(user)
    db.session.commit()
    return "Added a user"

@app.route("/channel/<name>")
def createChannel(name):
    channel = Channel(name=name)
    db.session.add(channel)
    db.session.commit()
    return "Added a channel"

@app.route("/getuser/<name_first>")
def get_user(name_first):
    user = TechsuiteUser.query.filter_by(name_first=name_first).first()
    return "Found: {}".format(user)
    
# The following method will map the classes we defined into tables (running CREATE TABLE)
# Only need to run this once to create all the tables required 
db.create_all()

if __name__ == '__main__':
    app.run(port=6969, debug=True)
    