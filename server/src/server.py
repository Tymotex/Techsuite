""" For server and app configuration and for startined the server """
# Standard libraries:
import logging
import sys
import os
import json

# Third party libraries:
from flask import Flask, jsonify, redirect
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from dotenv import load_dotenv
from oauthlib.oauth2 import WebApplicationClient
import requests

# Local imports:
from routes.auth_routes import auth_router
from routes.channels_routes import channels_router
from routes.users_routes import users_router
from routes.image_routes import image_router
from routes.admin_routes import admin_router
from routes.connection_routes import connection_router
from routes.http_error_handler import error_handler
from messages import message_send, message_remove, message_edit
from extensions import app
from util.util import printColour, get_user_from_token, select_channel, get_user_from_id, get_connection
from connections import connection_send_message, connection_edit_message, connection_remove_message
from exceptions import InputError
from authentication import auth_signup, auth_login
from users import users_profile_upload_photo


# Globals and app configuration
load_dotenv()
app.config["SECRET_KEY"] = os.getenv("SECRET_MESSAGE")
app.config["TRAP_HTTP_EXCEPTIONS"] = True
# Allowing cross-origin resource sharing
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Google auth configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_AUTH_API_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_AUTH_API_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# Registering modularised routers:
app.register_blueprint(auth_router, url_prefix='/api')
app.register_blueprint(channels_router, url_prefix='/api')
app.register_blueprint(users_router, url_prefix='/api')
app.register_blueprint(image_router, url_prefix='/api')
app.register_blueprint(admin_router, url_prefix='/api')
app.register_blueprint(connection_router, url_prefix='/api')

# Register a default error handler
app.register_error_handler(Exception, error_handler)

# ===== Google Auth Routes =====

# OAuth 2 client setup
client = WebApplicationClient(GOOGLE_CLIENT_ID)

@app.route("/api/asstest", methods=["GET"])
def asstest():
    return "HELLO WORLD"

@app.route("/api/google/login", methods=["GET"])
def google_login_redirect():
    # Find out what URL to hit for Google login consent page
    google_provider_cfg = get_google_provider_configuration()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri="https://techsuite.dev/api/google/login/callback",  # TODO: Hardcoded url
        scope=["openid", "email", "profile"],
    )
    print(" ➤ Redirecting user to Google auth page: {}".format(request_uri))
    # Redirect to Google’s authorization endpoint
    return jsonify({ "google_uri": request_uri })
    
# retrieving Google’s provider configuration:
def get_google_provider_configuration():
    return requests.get(GOOGLE_DISCOVERY_URL).json()

@app.route("/api/google/login/callback")
def callback():
    printColour(" ➤ Google auth callback: someone is trying to sign up.", colour="blue")
    
    # The provider gives US a unique authorisation code after we redirect to them
    # and after the user consents. Get authorization code Google sent back:
    code = request.args.get("code")

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = get_google_provider_configuration()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send a request to get tokens
    request_url = request.url[:4] + "s" + request.url[4:]                
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request_url,
        redirect_url="https://techsuite.dev/api/google/login/callback", 
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens!
    client.parse_request_body_response(json.dumps(token_response.json()))

    """
        Now that you have the necessary tools to get the user’s profile 
        information, you need to ask Google for it. Luckily, OIDC defines 
        a user information endpoint, and its URL for a given provider is 
        standardized in the provider configuration.
        You can get the location by checking the userinfo_endpoint field in the
        provider configuration document. 
    """
    # Now that you have tokens (yay) let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # You want to make sure their email is verified.
    # The user authenticated with Google, authorized your
    # app, and now you've verified their email through Google!
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
        print("Got info: {},\n{},\n{},\n{}".format(unique_id, users_email, picture, users_name))
    else:
        print("Problem: User email not available or not verified by Google.")
        return "User email not available or not verified by Google.", 400

    # Register the user, or log them in
    # Workaround for Google auth: the callback in the Flask server redirects back
    # to the homepage and embeds the token and id in the URL like this:
    #     /home/user_id/token
    # The token and ID are extracted and removed out of the URL and saved to the 
    # client's cookies 
    try:
        resp_data = auth_signup(users_email, "asdfasdf", users_name)
        if picture:
            users_profile_upload_photo(resp_data["token"], resp_data["user_id"], picture)
        printColour(" ➤ Google auth callback: Signed up: {}, {}".format(users_name, users_email), colour="blue")
        return redirect("https://techsuite.dev/home/{}/{}".format(resp_data["user_id"], resp_data["token"]))
    except:
        resp_data = auth_login(users_email, "asdfasdf")
        printColour(" ➤ Google auth callback: Logged in: {}, {}".format(users_name, users_email))
        return redirect("https://techsuite.dev/home/{}/{}".format(resp_data["user_id"], resp_data["token"]))

# ===== Basic Routes (For Testing) =====
# 'Landing' page:
@app.route("/api", methods=["GET"])
def index():
    printColour("Reached the API root")
    return jsonify({"message": "Reached the landing page"})

from flask import flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.getcwd() + r"/src/static/images/"    
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ===== Web Socket Events =====

# Error event
def emit_error(error, error_type="input_error"):
    if (isinstance(error, InputError)):
        emit("input_error", error.get_message())   
    else:
        emit("input_error", error.__repr__())      

# ===== Connect/Disconnect hooks =====

@socketio.on('connect', namespace='/ts-socket')
def handle_connect():
    join_room(request.sid)
    printColour(" ➤ Client joined to session: {}".format(request.sid), bordersOn=False, colour="green")

@socketio.on('disconnect', namespace='/ts-socket')
def handle_connect():
    printColour(" ➤ Client disconnected", bordersOn=False, colour="orange")

# ===== Channel messaging socket event handlers =====

@socketio.on("send_message", namespace='/ts-socket')
def handle_send_message(token, channel_id, message, room):  
    calling_user = get_user_from_token(token)  
    target_channel = select_channel(channel_id)
    printColour(" ➤ Socket event: send_message. Message sent by {} to channel {}".format(
        calling_user.username,
        target_channel.name
    ), colour="cyan")
    printColour(" ➤ Emitting event: receive_message", colour="cyan", bordersOn=False)
    try:
        message_send(token, int(channel_id), message)
    except InputError as err:
        emit_error(err.get_message())
    # Broadcast the newly sent message to all listening client sockets so the
    # chat field updates in 'realtime'
    emit(
        "receive_message", "The server says: someone has sent a new message", 
        broadcast=True,
        room=room
    )

@socketio.on("remove_message", namespace='/ts-socket')
def handle_remove_message(token, message_id, room):
    calling_user = get_user_from_token(token)
    printColour(" ➤ Socket event: remove_message. Channel message {} was edited by {}".format(
        message_id, 
        calling_user.username
    ), colour="cyan", bordersOn=False)
    printColour(" ➤ Emitting event: message_removed", colour="cyan", bordersOn=False)
    try:
        message_remove(token, message_id)
    except InputError as err:
        emit_error(err.get_message())
    emit(
        "message_removed", "The server says: someone has deleted a message", 
        broadcast=True,
        room=room
    )

@socketio.on("edit_message", namespace='/ts-socket')
def handle_edit_message(token, message_id, message, room):
    calling_user = get_user_from_token(token)
    printColour(" ➤ Socket event: edit_message. Channel message {} was edited by {}".format(
        message_id, 
        calling_user.username
    ), colour="cyan", bordersOn=False)
    printColour(" ➤ Emitting event: message_edited", colour="cyan", bordersOn=False)
    try:
        message_edit(token, message_id, message)
        emit(
            "message_edited", 
            "The server says: someone has edited a message", 
            broadcast=True, 
            room=room
        )
    except InputError as err:
        print(type(err))
        emit_error(err)

@socketio.on("user_enter", namespace='/ts-socket')
def on_join(event_data):
    """
        Parameter event_data is a dictionary containing:
            - token
            - user_id
            - channel_id
            - room
    """
    token = event_data["token"]
    user = get_user_from_token(token)
    room = event_data["room"]
    join_room(room)

    printColour(" ➤ Socket event: user_enter. User {} entered channel {}".format(
        user.username, 
        room
    ), colour="cyan", bordersOn=False)
    emit("user_entered", broadcast=True, room=room)

@socketio.on("user_leave", namespace='/ts-socket')
def handle_user_channel_leave(event_data):
    """
        Parameter event_data is a dictionary containing:
            - token
            - user_id
            - channel_id
            - room
    """
    token = event_data["token"]
    user = get_user_from_token(token)
    room = event_data["room"]
    leave_room(room)

    printColour(" ➤ Socket event: user_leave. User {} left channel {}".format(
        user.username, 
        room
    ), colour="cyan", bordersOn=False)

# ===== Direct messaging =====

@socketio.on("send_connection_message", namespace='/ts-socket')
def handle_connection_send_message(token, user_id, message, room):
    try:
        connection_send_message(token, user_id, message)
    except InputError as err:
        emit_error(err.get_message())
    printColour("Client sent a direct message to {}".format(user_id))
    emit(
        "receive_connection_message",
        "The server says: your chat partner has sent a new message",
        broadcast=True,
        room=room
    )  

@socketio.on("edit_connection_message", namespace='/ts-socket')
def handle_connection_edit_message(token, message_id, message, room):
    try:
        connection_edit_message(token, message_id, message)
    except InputError as err:
        emit_error(err.get_message())
    printColour("Client edited a direct message")
    emit(
        "connection_message_edited",
        "The server says: your chat partner has edited a message",
        broadcast=True,
        room=room
    )     

@socketio.on("remove_connection_message", namespace='/ts-socket')
def handle_connection_remove_message(token, message_id, room):
    try:
        connection_remove_message(token, message_id)
    except InputError as err:
        emit_error(err.get_message())
    printColour("Client removed a direct message")
    emit(
        "connection_message_removed",
        "The server says: your chat partner has removed a message",
        broadcast=True,
        room=room
    )    

@socketio.on("connection_user_enter", namespace='/ts-socket')
def on_join(event_data):
    """
        Parameter event_data is a dictionary containing:
            - token
            - user_id
            - room
    """
    token = event_data["token"]
    calling_user = get_user_from_token(token)
    target_user = get_user_from_id(int(event_data["user_id"]))
    room = str(get_connection(calling_user.id, target_user.id).id)
    join_room(room)

    printColour(" ➤ Socket event: connection_user_enter. User {} started connection chat with {} (room: {})".format(
        calling_user.username, 
        target_user.username,
        room
    ), colour="cyan", bordersOn=False)
    emit(
        "connection_user_entered", 
        room, 
        broadcast=True, 
        room=room
    )

@socketio.on("connection_user_leave", namespace='/ts-socket')
def handle_user_channel_leave(event_data):
    """
        Parameter event_data is a dictionary containing:
            - token
            - room
    """
    token = event_data["token"]
    user = get_user_from_token(token)
    room = event_data["room"]
    leave_room(room)

    printColour(" ➤ Socket event: connection_user_leave. User {} left channel {}".format(
        user.username, 
        room
    ), colour="cyan", bordersOn=False)

# ===== Starting the server =====

if __name__ == "__main__":
    # Optionally supply an explicit port:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else os.getenv("PORT")
    # The port is specified in the .env file (which is parsed and loaded by the python-dotenv module)
    printColour(" ➤ Server listening on port {}".format(port))
    socketio.run(app, port=port, debug=True) 
