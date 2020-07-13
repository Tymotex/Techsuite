""" For server and app configuration and for startined the server """
# Standard libraries:
import logging
import sys
import os

# Third party libraries:
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from dotenv import load_dotenv

# Local imports:
from routes.auth_routes import auth_router
from routes.channels_routes import channels_router
from routes.users_routes import users_router
from routes.message_routes import message_router
from routes.image_routes import image_router
from routes.admin_routes import admin_router
from routes.http_error_handler import error_handler
from messages import message_send
from extensions import app
from util.util import printColour

# Globals and config
load_dotenv()
socketio = SocketIO(app, cors_allowed_origins="*")
app.config["SECRET_KEY"] = os.getenv("SECRET_MESSAGE")
app.config["TRAP_HTTP_EXCEPTIONS"] = True
# Allowing cross-origin resource sharing
CORS(app)

# Registering modularised routers:
app.register_blueprint(auth_router)
app.register_blueprint(channels_router)
app.register_blueprint(users_router)
app.register_blueprint(message_router)
app.register_blueprint(image_router)
app.register_blueprint(admin_router)

# Register a default error handler
app.register_error_handler(Exception, error_handler)

# ===== Basic Routes (For Testing) =====
# 'Landing' page:
@app.route("/", methods=["GET"])
def index():
    return '{"message": "Reached the landing page"}'

# ===== Web Socket Messaging =====
# TODO: Move sockets out of this file
@socketio.on('connect')
def handle_connect():
    printColour("Socket connection succeeded")

@socketio.on('message')
def handle_message(message):
    printColour("Received a message: {}".format(message))

@socketio.on("send_message")
def handle_send_message(token, channel_id, message):    
    printColour("Sending message -- {} -- to channel {}".format(message, channel_id), colour="violet")
    message_send(token, int(channel_id), message)
    # Broadcast the newly sent message to all listening client sockets so the
    # chat field updates in 'realtime'
    emit("receive_message", "The server has received your message", broadcast=True)

@socketio.on("started_typing")
def handle_typing_prompt():
    emit("show_typing_prompt", broadcast=True, include_self=False)

@socketio.on("stopped_typing")
def handle_typing_prompt():
    printColour("NUM_USERS_TYPING: {}".format(NUM_USERS_TYPING), colour="red")
    emit("hide_typing_prompt", broadcast=True, include_self=False)    

# ===== Starting the server =====
if __name__ == "__main__":
    # Optionally supply an explicit port:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else os.getenv("PORT")
    # The port is specified in the .env file (which is parsed and loaded by the python-dotenv module)
    socketio.run(app, port=port, debug=True)
