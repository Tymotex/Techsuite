import sys
import os
from json import dumps
from PIL import Image
import requests
from flask import Flask, request, send_file, jsonify, Blueprint
from flask_cors import CORS
from exceptions import InputError
from dotenv import load_dotenv

# Routes
from routes.auth_routes import auth_router
from routes.channels_routes import channels_router
from routes.users_routes import users_routers

# Source files
import messages
import users
from database import get_data, show_data

# Globals and config
load_dotenv()
PROFILE_IMG_DIRECTORY = os.getcwd() + r"/static/images/"
APP = Flask(__name__)

# Allowing cross-origin resource sharing
CORS(APP)

# Importing modularised routes:
APP.register_blueprint(auth_router)
APP.register_blueprint(channels_router)
APP.register_blueprint(users_routers)

# HTTP error handling:
def default_error_handler(err):
    """
        Default error handler
    """
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, default_error_handler)

# 'Landing' page:
@APP.route("/", methods=["GET"])
def index():
    return "Index page"

# Serving images from the 'static/images' directory
@APP.route("/images/<filename>")
def serve_image(filename):
    """ Given an image filename, serves that image back with Flask's send_file """
    return send_file("static/images/{}".format(filename))

if __name__ == "__main__":
    # Optionally supply an explicit port:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else os.getenv("PORT")
    # The port is specified in the .env file (which is parsed and loaded by the python-dotenv module)
    APP.run(port=port, debug=True)
