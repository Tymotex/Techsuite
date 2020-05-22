import sys, os, requests
from json import dumps
from PIL import Image
from flask import Flask, request, send_file, jsonify, Blueprint
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from exceptions import InputError
from dotenv import load_dotenv

# Routes
from routes.auth_routes import auth_router
from routes.channels_routes import channels_router
from routes.users_routes import users_router
from routes.message_routes import message_router

# Source files
from messages import message_send
from database import get_data, show_data
from util import printColour

# Globals and config
load_dotenv()
PROFILE_IMG_DIRECTORY = os.getcwd() + r"/static/images/"
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# TODO: Store a secret string in .env
app.config["SECRET_KEY"] = "MYDIRTYSECRET"

# Allowing cross-origin resource sharing
CORS(app)

# Importing modularised routes:
app.register_blueprint(auth_router)
app.register_blueprint(channels_router)
app.register_blueprint(users_router)
app.register_blueprint(message_router)

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

app.config['TRAP_HTTP_EXCEPTIONS'] = True
app.register_error_handler(Exception, default_error_handler)

# 'Landing' page:
@app.route("/", methods=["GET"])
def index():
    return "Index page"

# Serving images from the 'static/images' directory
@app.route("/images/<filename>")
def serve_image(filename):
    """ Given an image filename, serves that image back with Flask's send_file """
    return send_file("static/images/{}".format(filename))

@socketio.on('connect')
def handle_connect():
    printColour("Socket connection succeeded")

@socketio.on('message')
def handle_message(message):
    printColour("Received a message: {}".format(message))

@socketio.on("send_message")
def handle_send_message(token, channel_id, message):    
    message_send(token, int(channel_id), message)
    # Broadcast the newly sent message to all listening client sockets so the
    # chat field updates in 'realtime'
    emit("receive_message", "The server says hi", broadcast=True)

if __name__ == "__main__":
    # Optionally supply an explicit port:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else os.getenv("PORT")
    # The port is specified in the .env file (which is parsed and loaded by the python-dotenv module)
    socketio.run(app, port=port, debug=True)
