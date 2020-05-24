from server_db_test import db
from datetime import datetime

# This class will map to a database table. Objects of this class will map to tuples of that table
class TechsuiteUser(db.Model):
    # Defining some attributes of this relation
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    permission_id = db.Column(db.Integer)
    
    # db.relationship() 
    # backref="name" will declare a new property on 'Bio' objects that lets us access the user given the bio tuple (back reference) 
    # uselist=False tells SQLAlchemy that this is a one-to-one relationship
    bio_id = db.relationship("Bio", backref="techsuiteUser", lazy=True, uselist=False)
    
    # Passing datetime.now as the callback function which is executed everytime a new record is added
    time_created = db.Column(db.DateTime, default=datetime.now)  
    
    def __repr__(self):
        return "<User {}>".format(self.first_name)

class Bio(db.Model):
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
    
    # nullable=False declares the attribute with constraint: NOT NULL. This is implicit for attributes declared as primary keys
    user_id = db.Column(db.Integer, db.ForeignKey("techsuiteUser.id"), nullable=False)

class Channel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))            # Allow 30 characters for channel names
    description = db.Column(db.String(1000))   # Allow 1000 characters for channel descriptions
    visibility = db.String(30)
    time_created = db.Column(db.DateTime, default=datetime.now)  
    
    def __repr__(self):
        return "<Channel {}>".format(self.name)


