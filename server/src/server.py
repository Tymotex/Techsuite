""" For server and app configuration and for startined the server """
# Standard libraries:
import logging
import sys
import os

# Third party libraries:
from flask import Flask, jsonify
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
from routes.connection_routes import connection_router
from routes.http_error_handler import error_handler
from messages import message_send, message_remove, message_edit
from extensions import app
from util.util import printColour
from connections import connection_send_message, connection_edit_message, connection_remove_message
from exceptions import InputError

# Globals and config
load_dotenv()
socketio = SocketIO(app, cors_allowed_origins="*")
app.config["SECRET_KEY"] = os.getenv("SECRET_MESSAGE")
app.config["TRAP_HTTP_EXCEPTIONS"] = True
# Allowing cross-origin resource sharing
CORS(app)

# Registering modularised routers:
app.register_blueprint(auth_router, url_prefix='/api')
app.register_blueprint(channels_router, url_prefix='/api')
app.register_blueprint(users_router, url_prefix='/api')
app.register_blueprint(message_router, url_prefix='/api')
app.register_blueprint(image_router, url_prefix='/api')
app.register_blueprint(admin_router, url_prefix='/api')
app.register_blueprint(connection_router, url_prefix='/api')

# Register a default error handler
app.register_error_handler(Exception, error_handler)

# ===== Basic Routes (For Testing) =====
# 'Landing' page:
@app.route("/api", methods=["GET"])
def index():
    printColour("Reached the API root")
    return jsonify({"message": "Reached the landing page"})


from flask import flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.getcwd() + r"/src/static/images/"        # TODO: Not robust? Cwd should always be project root
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/users/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file', filename=filename))
    return '''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new File</h1>
        <form method=post enctype=multipart/form-data>
        <input type=file name=file>
        <input type=submit value=Upload>
        </form>
    '''



# ===== Web Socket Events =====
# TODO: Move socket handling out of this file

# Error event
def emit_error(error, error_type="input_error"):
    if (isinstance(error, InputError)):
        emit("input_error", error.get_message(), broadcast=True)   # TODO Need to selectively broadcast
    else:
        emit("input_error", error.__repr__(), broadcast=True)      # TODO Need to selectively broadcast

# Channel messaging

@socketio.on('connect', namespace='/ts-socket')
def handle_connect():
    printColour("Socket connection succeeded")

@socketio.on('message', namespace='/ts-socket')
def handle_message(message):
    printColour("Received a message: {}".format(message))

@socketio.on("send_message", namespace='/ts-socket')
def handle_send_message(token, channel_id, message):    
    printColour("Sending message -- {} -- to channel {}".format(message, channel_id), colour="violet")
    try:
        message_send(token, int(channel_id), message)
    except InputError as err:
        emit_error(err.get_message())
    # Broadcast the newly sent message to all listening client sockets so the
    # chat field updates in 'realtime'
    emit("receive_message", "The server says: someone has sent a new message", broadcast=True)

@socketio.on("remove_message", namespace='/ts-socket')
def handle_remove_message(token, message_id):
    try:
        message_remove(token, message_id)
    except InputError as err:
        emit_error(err.get_message())
    emit("message_removed", "The server says: someone has deleted a message", broadcast=True)

@socketio.on("edit_message", namespace='/ts-socket')
def handle_edit_message(token, message_id, message):
    try:
        print("HERE")
        message_edit(token, message_id, message)
        print("NOW HERE")
        emit("message_edited", "The server says: someone has edited a message", broadcast=True)
    except InputError as err:
        print(type(err))
        print("INPUT ERROR OCCURRED")
        emit_error(err)
    finally:
        print("FINALLY")

@socketio.on("started_typing", namespace='/ts-socket')
def handle_typing_prompt(token):
    # TODO: Get user, broadcast to everyone else in the room that this user is typing
    emit("show_typing_prompt", broadcast=True, include_self=False)

@socketio.on("stopped_typing", namespace='/ts-socket')
def handle_typing_prompt(token):
    printColour("NUM_USERS_TYPING: {}".format(42), colour="red_1")
    emit("hide_typing_prompt", broadcast=True, include_self=False)    

@socketio.on("channel_join", namespace='/ts-socket')
def handle_channel_join():
    # TODO: Implement this
    printColour("SOMEONE HAS JOINED THE CHAT", colour="violet")

@socketio.on("channel_leave", namespace='/ts-socket')
def handle_channel_leave():
    # TODO: Implement this
    printColour("SOMEONE HAS LEFT THE CHAT", colour="violet")

# Direct messaging

@socketio.on("send_connection_message", namespace='/ts-socket')
def handle_connection_send_message(token, user_id, message):
    try:
        connection_send_message(token, user_id, message)
    except InputError as err:
        emit_error(err.get_message())
    printColour("Client sent a direct message to {}".format(user_id))
    emit("receive_connection_message", "The server says: your chat partner has sent a new message", broadcast=True)   # TODO: NEed to selectively broadcast

@socketio.on("edit_connection_message", namespace='/ts-socket')
def handle_connection_edit_message(token, message_id, message):
    try:
        connection_edit_message(token, message_id, message)
    except InputError as err:
        emit_error(err.get_message())
    printColour("Client edited a direct message")
    emit("connection_message_edited", "The server says: your chat partner has edited a message", broadcast=True)     # TODO: NEed to selectively broadcast

@socketio.on("remove_connection_message", namespace='/ts-socket')
def handle_connection_remove_message(token, message_id):
    try:
        connection_remove_message(token, message_id)
    except InputError as err:
        emit_error(err.get_message())
    printColour("Client removed a direct message")
    emit("connection_message_removed", "The server says: your chat partner has removed a message", broadcast=True)    # TODO: NEed to selectively broadcast

# ===== Starting the server =====
if __name__ == "__main__":
    # Optionally supply an explicit port:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else os.getenv("PORT")
    # The port is specified in the .env file (which is parsed and loaded by the python-dotenv module)
    printColour("Server listening on port {}".format(port))
    socketio.run(app, port=port, debug=True)  # TODO: Allow specified port configuration
