from server_db_test import db
from datetime import datetime
from util import printColour

# This class will map to a database table. Objects of this class will map to tuples of that table
class TechsuiteUser(db.Model):
    # Defining some attributes of this relation
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_img_url = db.Column(db.String(255))
    cover_img_url = db.Column(db.String(255))
    permission_id = db.Column(db.Integer)
    # Passing datetime.now as the callback function which is executed everytime a new record is added
    time_created = db.Column(db.DateTime, default=datetime.now)  

class Channel(db.Model):
    # Defining some attributes of this relation
    channel_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))            # Allow 30 characters for channel names
    description = db.Column(db.String(1000))   # Allow 1000 characters for channel descriptions
    visibility = db.String(30)
    time_created = db.Column(db.DateTime, default=datetime.now)  


