from flask import Blueprint, request, jsonify
from util.util import printColour, crop_image_file, get_latest_filename, get_user_from_id
from util.token import get_user_from_token
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
            users: [ {
                user_id, 
                email, 
                username, 
                profile_img_url, 
                summary,
                first_name,
                last_name,
                location,
                education,
                ... other bio fields     
            }, ... ]
        }
    """
    token = request.args.get("token")

    calling_user = get_user_from_token(token)
    printColour(" ➤ Connections: {} is fetching a list of their existing connections".format({
        calling_user.username
    }), colour="blue")
    
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

    calling_user = get_user_from_token(token)
    printColour(" ➤ Connections Incoming: {} is fetching a list of their incoming connections".format(
        calling_user.username
    ), colour="blue")

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

    calling_user = get_user_from_token(token)
    printColour(" ➤ Connections: {} is fetching a list of their outgoing connections".format(
        calling_user.username
    ), colour="blue")

    return jsonify(connections.connection_fetch_outgoing_users(token))

@connection_router.route("/connections/info", methods=['GET'])
def handle_connection_get_info():
    """
        Fetches details regarding the connection between two users
        Params: (token, user_id)
        Returns JSON: {
            is_connected, connection_is_pending, is_requester
        }
    """
    token = request.args.get("token")
    user_id = int(request.args.get("user_id"))
    calling_user = get_user_from_token(token)
    target_user = get_user_from_id(user_id)
    printColour(" ➤ Connections: {} is fetching connection details with {}".format(
        calling_user.username,
        target_user.username
    ), colour="blue")
    return jsonify(connections.connection_fetch_info(token, user_id))


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

    calling_user = get_user_from_token(token)
    target_user = get_user_from_id(user_id)
    printColour(" ➤ Connections Request: {} sent a connection request to {}".format(
        calling_user.username, 
        target_user.username
    ), colour="blue")
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

    calling_user = get_user_from_token(token)
    target_user = get_user_from_id(user_id)
    printColour(" ➤ Connections Acccept: {} approved {}'s connection request".format(
        calling_user.username, 
        target_user.username
    ), colour="blue")

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

    calling_user = get_user_from_token(token)
    target_user = get_user_from_id(user_id)
    printColour(" ➤ Connections Remove: {} removed {} as a connection".format(
        calling_user.username, 
        target_user.username
    ), colour="blue")

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

    calling_user = get_user_from_token(token)
    target_user = get_user_from_id(user_id)
    printColour(" ➤ Connections Messages: {} fetched messages with {}".format(
        calling_user.username, 
        target_user.username
    ), colour="blue")

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

    calling_user = get_user_from_token(token)
    target_user = get_user_from_id(user_id)
    printColour(" ➤ Connections Messages: {} sent a message to {}".format(
        calling_user.username, 
        target_user.username
    ), colour="blue")

    return jsonify(connections.connection_send_message(token, user_id, message))

@connection_router.route("/connections/message", methods=['PUT'])
def handle_conection_edit_message():
    """
        HTTP Route: /connections/message
        HTTP Method: PUT
        Params: (token, message_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["data"]["token"]
    message_id = int(request_data["data"]["message_id"])
    message = request_data["data"]["message"]

    calling_user = get_user_from_token(token)
    printColour(" ➤ Connections Messages: {} edited message id: {}".format(
        calling_user.username,
        message_id
    ), colour="blue")

    return jsonify(connections.connection_edit_message(token, message_id, message))

@connection_router.route("/connections/message", methods=['DELETE'])
def handle_conection_remove_message():
    """
        HTTP Route: /connections/message
        HTTP Method: DELETE
        Params: (token, message_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    
    calling_user = get_user_from_token(token)
    printColour(" ➤ Connections Messages: {} removed message id: {}".format(
        calling_user.username,
        message_id
    ), colour="blue")

    return jsonify(connections.connection_remove_message(token, message_id))
