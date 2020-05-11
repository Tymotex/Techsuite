from flask import Blueprint, request, jsonify
from authentication import auth_register, auth_login, auth_logout 
import channels

channels_router = Blueprint("channels", __name__)

@channels_router.route("/channels/invite", methods=['POST'])
def handle_channel_invite():
    """
    HTTP Route: /channels/invite
    HTTP Method: POST
    Params: (token, channel_id, u_id)

    Return dumps(results)   (str)
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    u_id = int(request_data["u_id"])
    results = channels.channels_invite(token, channel_id, u_id)
    return dumps(results)

@channels_router.route("/channels/details", methods=['GET'])
def handle_channel_details():
    """
    HTTP Route: /channels/details
    HTTP Method: GET
    Params: (token, channel_id)

    Return dumps(results)   (str)
    """
    token = request.args.get("token")
    channel_id = int(request.args.get("channel_id"))
    results = channels.channels_details(token, channel_id)
    return dumps(results)

@channels_router.route("/channels/messages", methods=['GET'])
def handle_channel_messages():
    """
    HTTP Route: /channels/messages
    HTTP Method: GET
    Params: (token, channel_id, start)

    Return dumps(results)   (str)
    """
    token = request.args.get("token")
    channel_id = int(request.args.get("channel_id"))
    start = int(request.args.get("start"))
    results = channels.channels_messages(token, channel_id, start)
    return dumps(results)

@channels_router.route("/channels/leave", methods=['POST'])
def handle_channel_leave():
    """
    HTTP Route: /channels/leave
    HTTP Method: POST
    Params: (token, channel_id)

    Return dumps(results)   (str)
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    results = channels.channels_leave(token, channel_id)
    return dumps(results)

@channels_router.route("/channels/join", methods=['POST'])
def handle_channel_join():
    """
    HTTP Route: /channels/join
    HTTP Method: POST
    Params: (token, channel_id)

    Return dumps(results)   (str)
    """
    print("CHANNEL JOIN:")
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    results = channels.channels_join(token, channel_id)
    return dumps(results)

@channels_router.route("/channels/addowner", methods=['POST'])
def handle_channel_addowner():
    """
    HTTP Route: /channels/addowner
    HTTP Method: POST
    Params: (token, channel_id, u_id)

    Return dumps(results)   (str)
    """
    print("CHANNEL ADDOWNER:")
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    u_id = int(request_data["u_id"])
    results = channels.channels_addowner(token, channel_id, u_id)
    return dumps(results)

@channels_router.route("/channels/removeowner", methods=['POST'])
def handle_channel_removeowner():
    """
    HTTP Route: /channels/removeowner
    HTTP Method: POST
    Params: (token, channel_id, u_id)

    Return dumps(results)   (str)
    """
    print("CHANNEL REMOVEOWNER:")
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    u_id = int(request_data["u_id"])
    results = channels.channels_removeowner(token, channel_id, u_id)
    return dumps(results)

@channels_router.route("/channels/list", methods=['GET'])
def handle_channels_list():
    """
    HTTP Route: /channels/list
    HTTP Method: GET
    Params: (token)

    Return dumps(results)   (str)
    """
    print("CHANNELS LIST:")
    token = request.args.get("token")
    user_channels = channels.channels_list(token)
    return dumps(user_channels)

@channels_router.route("/channels/listall", methods=['GET'])
def handle_channels_listall():
    """
    HTTP Route: /channels/listall
    HTTP Method: GET
    Params: (token)

    Return dumps(results)   (str)
    """
    print("*** CHANNELS LISTALL ***")
    token = request.args.get("token")
    all_channels = channels.channels_listall(token)
    return dumps(all_channels)

@channels_router.route("/channels/create", methods=['POST'])
def handle_channels_create():
    """
    HTTP Route: /channels/create
    HTTP Method: POST
    Params: (token, name, description, is_public)

    Return dumps(results)   (str)
    """
    print("*** CREATING CHANNEL ***")
    request_data = request.get_json()
    token = request_data["token"]
    name = request_data["name"]
    description = request_data["description"]
    is_public = request_data["is_public"]
    results = channels.channels_create(token, name, description, is_public)
    return dumps(results)
