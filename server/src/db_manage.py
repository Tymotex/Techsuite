from database import db
from models import *
from util import printColour

# ===== Basic Admin Functions =====
def create_all():
    printColour("Creating all tables", colour="green")
    db.create_all()

def drop_all():
    printColour("Dropping all tables", colour="red")
    db.drop_all()
