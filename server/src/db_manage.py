from server import db
import models
from util import printColour

# ===== Basic Admin Functions =====
def create_all_tables():
    printColour("Creating all tables", colour="green")
    db.create_all()

def wipe_all_tables():
    printColour("Dropping all tables", colour="red")
    db.drop_all()
