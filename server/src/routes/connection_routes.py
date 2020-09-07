from flask import Blueprint, request, jsonify
from util.util import printColour, crop_image_file, get_latest_filename
from dotenv import load_dotenv
import os
from exceptions import InputError
import connections
import pprint

# Globals and config:
load_dotenv()
connection_router = Blueprint("connections", __name__)
BASE_URL = "http://localhost:{0}".format(os.getenv("PORT"))

# ===== Fetching Connections =====

@connection_router.route("/connections", methods=['GET'])
def handle_connection_fetch():
    """
        Fetches all of the users that the calling user is connected with
        Params: (token)
        Returns JSON: { 
            users: [ { user_id, email, username, profile_img_url }, ... ]
        }
    """
    token = request.args.get("token")
    return jsonify(connections.connection_fetch_users(token))

@connection_router.route("/connections/incoming", methods=['GET'])
def handle_connection_incoming():
    """
        Fetches all of the users that have sent a connection request to the caller
        Params: (token)
        Returns JSON: { 
            users: [ { user_id, email, username, profile_img_url }, ... ]
        }
    """
    token = request.args.get("token")
    printColour("FETCHING INCOMING CONNECTIONS", colour="violet")
    return jsonify(connections.connection_fetch_incoming_users(token))

@connection_router.route("/connections/outgoing", methods=['GET'])
def handle_connection_outgoing():
    """
        Fetches all of the users that the calling user has sent requests to
        Params: (token)
        Returns JSON: { 
            users: [ { user_id, email, username, profile_img_url }, ... ]
        }
    """
    token = request.args.get("token")
    printColour("FETCHING OUTGOING CONNECTIONS", colour="violet")
    return jsonify(connections.connection_fetch_outgoing_users(token))

# ===== Connections Operations =====

@connection_router.route("/connections/request", methods=['POST'])
def handle_conection_request():
    """
        HTTP Route: /connections/request
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    user_id = int(request_data["user_id"])
    printColour("Added pending connection request from to user id {}".format(user_id))
    return jsonify(connections.connection_request(token, user_id))

@connection_router.route("/connections/accept", methods=['POST'])
def handle_conection_accept():
    """
        HTTP Route: /connections/accept
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    user_id = int(request_data["user_id"])
    printColour("Approving connection to user id {}".format(user_id))
    return jsonify(connections.connection_accept(token, user_id))

@connection_router.route("/connections/remove", methods=['POST'])
def handle_conection_remove():
    """
        HTTP Route: /connections/remove
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    user_id = int(request_data["user_id"])
    printColour("Removing connection to user id {}".format(user_id))
    return jsonify(connections.connection_remove(token, user_id))

# ===== Sending Messages =====

@connection_router.route("/connections/message", methods=['GET'])
def handle_conection_fetch_messages():
    """
        HTTP Route: /connections/message
        HTTP Method: GET
        Params: (token, user_id)
        Returns JSON: { messages: [ { message_id, message, sender_id, time_created } ] }
    """
    token = request.args.get("token")
    user_id = int(request.args.get("user_id"))
    printColour("Sending message to user: {}".format(user_id))
    return jsonify(connections.connection_fetch_messages(token, user_id))

@connection_router.route("/connections/message", methods=['POST'])
def handle_conection_send_message():
    """
        HTTP Route: /connections/message
        HTTP Method: POST
        Params: (token, user_id, message)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    user_id = int(request_data["user_id"])
    message = request_data["message"]
    printColour("Sending message to user: {}".format(user_id))
    return jsonify(connections.connection_send_message(token, user_id, message))

@connection_router.route("/connections/message", methods=['GET'])
def handle_conection_get_message():
    """
        HTTP Route: /connections/sendmessage
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: { messages }
    """
    return jsonify({})
