# Standard libraries: 
import os

# Third party libraries:
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Local imports:
from extensions import db

# Globals and config
load_dotenv()

# Aliasing common SQLAlchemy names
Column = db.Column
relationship = db.relationship

