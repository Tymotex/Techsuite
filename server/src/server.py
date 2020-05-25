""" For server and app configuration and for startined the server """
# Libraries
import sys, os
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from dotenv import load_dotenv

# Route handlers and sockets
from routes.auth_routes import auth_router
from routes.channels_routes import channels_router
from routes.users_routes import users_router
from routes.message_routes import message_router
from routes.image_routes import image_router
from routes.http_error_handler import error_handler

# Source files
from messages import message_send
from database import app
from util import printColour

# Globals and config
load_dotenv()
PROFILE_IMG_DIRECTORY = os.getcwd() + r"/static/images/"
socketio = SocketIO(app, cors_allowed_origins="*")
app.config["SECRET_KEY"] = os.getenv("SECRET_MESSAGE")
app.config["TRAP_HTTP_EXCEPTIONS"] = True

# Allowing cross-origin resource sharing
CORS(app)

# Registering modularised routers:
app.register_blueprint(auth_router)
app.register_blueprint(channels_router)
# app.register_blueprint(users_router)
# app.register_blueprint(message_router)
# app.register_blueprint(image_router)

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
    message_send(token, int(channel_id), message)
    # Broadcast the newly sent message to all listening client sockets so the
    # chat field updates in 'realtime'
    emit("receive_message", "The server has received your message", broadcast=True)

# ===== Starting the server =====
if __name__ == "__main__":
    # Optionally supply an explicit port:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else os.getenv("PORT")
    # The port is specified in the .env file (which is parsed and loaded by the python-dotenv module)
    socketio.run(app, port=port, debug=True)
