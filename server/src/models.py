from extensions import db
from datetime import datetime

# This class will map to a database table. Objects of this class will map to tuples of that table
class User(db.Model):
    __tablename__ = "techsuite_users"
    # Defining some attributes of this relation
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    permission_id = db.Column(db.Integer)
    username = db.Column(db.String(50))

    bio_id = db.Column(db.Integer, db.ForeignKey("bios.id"), nullable=False)
    # Passing datetime.now as the callback function which is executed everytime a new record is added
    time_created = db.Column(db.DateTime, default=datetime.now)  
    
    # Relationships
    channel_membership = db.relationship("MemberOf", backref="user", lazy=True)
    messages_sent = db.relationship("Message", backref="user", lazy=True)
    
    def __repr__(self):
        return "<User {}>".format(self.id)

class Bio(db.Model):
    __tablename__ = "bios"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_img_url = db.Column(db.String(255))
    cover_img_url = db.Column(db.String(255))
    summary = db.Column(db.String(1000))
    location = db.Column(db.String(255))
    title = db.Column(db.String(50))
    education = db.Column(db.String(255))
    # backref="bio" will declare a new property TechsuiteUser.bio for referencing 
    # nullable=False declares the attribute with constraint: NOT NULL. This is implicit for attributes declared as primary keys
    owner = db.relationship("User", backref="bio", lazy=True)
    def __repr__(self):
        return "<Bio {}>".format(self.id)

class Channel(db.Model):
    __tablename__ = "channels"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)     # Allow 30 characters for channel names
    description = db.Column(db.String(1000))            # Allow 1000 characters for channel descriptions
    visibility = db.Column(db.String(30), nullable=False)
    channel_img_url = db.Column(db.String(255))
    channel_cover_img_url = db.Column(db.String(255))
    time_created = db.Column(db.DateTime, default=datetime.now)

    # Note: uselist=False tells SQLAlchemy that this is a one-to-one relationship
    channel_membership = db.relationship("MemberOf", backref="channel", lazy=True)
    messages_sent = db.relationship("Message", backref="channel", lazy=True)
    def __repr__(self):
        return "<Channel {}>".format(self.id)

class MemberOf(db.Model):
    __tablename__ = "member_of"
    user_id = db.Column(db.Integer, db.ForeignKey("techsuite_users.id"), nullable=False, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"), nullable=False, primary_key=True)
    is_owner = db.Column(db.Boolean)
    def __repr__(self):
        return "<MemberOf (user_id: {}, channel_id: {}, is_owner: {})>".format(self.user_id, self.channel_id, self.is_owner)

class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("techsuite_users.id"), nullable=False)
    message = db.Column(db.String(1000))       # Allow 1000 characters for messages
    time_created = db.Column(db.DateTime, default=datetime.now())
    def __repr__(self):
        return "<Message {}>".format(self.id)
