from flask import Blueprint
from datetime import datetime

from database_config import db
from models import User, Bio, Channel, Message, MemberOf

db_router = Blueprint("db_route_test", __name__)

# Example: http://.../user/example@gmail.com/tymotex/john/smith/password
# Example: http://.../user/example@gmail.com/cse_chad/richard/buckland/password
@db_router.route("/user/<email>/<username>/<first_name>/<last_name>/<password>")
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
@db_router.route("/channel/<name>/<description>/<visibility>")
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

@db_router.route("/allusers")
def get_all_users():
    users = User.query.all()
    result = ""
    for eachUser in users:
        result += "{} {} - {}\n".format(eachUser.bio.first_name, eachUser.bio.last_name, eachUser.email)
    return result

# http://.../message/1/1/thisismymessage
@db_router.route("/message/<user_id>/<channel_id>/<message_body>")
def create_message(user_id, channel_id, message_body):
    user = User.query.filter_by(id=user_id).first()
    channel = Channel.query.filter_by(id=channel_id).first()    
    message = Message(
        message=message_body,
        user=user,
        channel=channel
    )
    db.session.add(message)
    db.session.commit()
    return "Added a message"

