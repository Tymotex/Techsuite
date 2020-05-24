import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
app = Flask(__name__)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")

db = SQLAlchemy(app)

# ===== CLASSES =====

# This class will map to a database table. Objects of this class will map to tuples of that table
class User(db.Model):
    __tablename__ = "techsuite_users"
    # Defining some attributes of this relation
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    permission_id = db.Column(db.Integer)
    username = db.Column(db.String(50))
    # db.relationship() 
    # uselist=False tells SQLAlchemy that this is a one-to-one relationship
    bio_id = db.Column(db.Integer, db.ForeignKey("bios.id"), nullable=False)
    # Passing datetime.now as the callback function which is executed everytime a new record is added
    time_created = db.Column(db.DateTime, default=datetime.now)  
    
    member_of = db.relationship("MemberOf", backref="user", lazy=True)
    message_id = db.relationship("Message", backref="user", lazy=True)
    
    def __repr__(self):
        return "<User {}>".format(self.first_name)

class Bio(db.Model):
    __tablename__ = "bios"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_img_url = db.Column(db.String(255))
    cover_img_url = db.Column(db.String(255))
    birthday = db.Column(db.DateTime)
    summary = db.Column(db.String(1000))
    location = db.Column(db.String(255))
    title = db.Column(db.String(50))
    education = db.Column(db.String(255))
    # backref="bio" will declare a new property TechsuiteUser.bio for referencing 
    # nullable=False declares the attribute with constraint: NOT NULL. This is implicit for attributes declared as primary keys
    user_id = db.relationship("User", backref="bio", lazy=True)

class Channel(db.Model):
    __tablename__ = "channels"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))            # Allow 30 characters for channel names
    description = db.Column(db.String(1000))   # Allow 1000 characters for channel descriptions
    visibility = db.String(30)
    time_created = db.Column(db.DateTime, default=datetime.now)
    
    member_of = db.relationship("MemberOf", backref="channel", lazy=True)
    message_id = db.relationship("Message", backref="channel", lazy=True)
    
    def __repr__(self):
        return "<Channel {}>".format(self.name)

class MemberOf(db.Model):
    __tablename__ = "member_of"
    user_id = db.Column(db.Integer, db.ForeignKey("techsuite_users.id"), nullable=False, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"), nullable=False, primary_key=True)
    is_owner = db.Column(db.Boolean)

class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("techsuite_users.id"), nullable=False)
    message = db.Column(db.String(1000))       # Allow 1000 characters for messages
    time_created = db.Column(db.DateTime, default=datetime.now())
    
# ===================

@app.route("/")
def hello():
    return "Hello. This works"

# Example: http://.../user/example@gmail.com/tymotex/john/smith/password
@app.route("/user/<email>/<username>/<first_name>/<last_name>/<password>")
def create_user(email, username, first_name, last_name, password, ):
    bio = Bio(
        first_name=first_name,
        last_name=last_name,
        birthday=datetime.now(),
        summary="This is some filler",
        location="Sydney",
        title="Student",
        education="Bachelors of Engineering (Software) at UNSW"
    )
    user = User(
        email=email,
        username=username,
        password=password,
        permission_id=1,
        bio=bio
    )
    db.session.add(bio)
    db.session.add(user)
    db.session.commit()
    return "Added a user and their bio"

# Example: http://.../channel/amazingchannel/channeldescription/public
@app.route("/channel/<name>/<description>/<visibility>")
def create_channel(name, description, visibility):
    channel = Channel(
        name=name,
        description=description,
        visibility=visibility
    )
    creator = User.query.first()
    memberOf = MemberOf(
        is_owner=True,
        user=creator,
        channel=channel
    )
    db.session.add(channel)
    db.session.add(memberOf)
    db.session.commit()
    return "Added a channel"

@app.route("/allusers")
def get_all_users():
    users = User.query.all()
    result = ""
    for eachUser in users:
        result += "{}\n".format(eachUser.first_name)
    return result

# http://.../message/1/1/thisismymessage
@app.route("/message/<user_id>/<channel_id>/<message_body>")
def create_message(user_id, channel_id, message_body):
    user = User.query.filter_by(id=user_id).first()
    channel = Channel.query.filter_by(id=channel_id).first()
    print("Obtained user {}".format(user.email))
    print("Obtained chan {}".format(channel.name))
    
    message = Message(
        message=message_body,
        user=user,
        channel=channel
    )
    db.session.add(message)
    db.session.commit()
    return "Added a message"
    
if __name__ == '__main__':
    app.run(port=6970, debug=True)
    