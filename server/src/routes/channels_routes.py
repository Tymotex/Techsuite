from flask import Blueprint, request, jsonify
from util import printColour
import channels

channels_router = Blueprint("channels", __name__)

@channels_router.route("/channels/invite", methods=['POST'])
def handle_channel_invite():
    """
        HTTP Route: /channels/invite
        HTTP Method: POST
        Params: (token, channel_id, user_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    user_id = int(request_data["user_id"])
    printColour("Channel Invite: {}".format(request_data), colour="violet")
    return jsonify(channels.channels_invite(token, channel_id, user_id))

@channels_router.route("/channels/details", methods=['GET'])
def handle_channel_details():
    """
        HTTP Route: /channels/details
        HTTP Method: GET
        Params: (token, channel_id)
        Returns JSON: { name, description, owner_members, all_members }
    """
    token = request.args.get("token")
    channel_id = int(request.args.get("channel_id"))
    printColour("Channel Details: {}".format(request.args), colour="violet")
    return jsonify(channels.channels_details(token, channel_id))

@channels_router.route("/channels/messages", methods=['GET'])
def handle_channel_messages():
    """
        HTTP Route: /channels/messages
        HTTP Method: GET
        Params: (token, channel_id, start)
        Returns JSON: { messages, exhausted }
    """
    token = request.args.get("token")
    channel_id = int(request.args.get("channel_id"))
    start = int(request.args.get("start"))
    printColour("Channel Messages: {}".format(request.args), colour="violet")
    return jsonify(channels.channels_messages(token, channel_id, start))

@channels_router.route("/channels/leave", methods=['POST'])
def handle_channel_leave():
    """
        HTTP Route: /channels/leave
        HTTP Method: POST
        Params: (token, channel_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    printColour("Channel Leave: {}".format(request_data), colour="violet")
    return jsonify(channels.channels_leave(token, channel_id))

@channels_router.route("/channels/join", methods=['POST'])
def handle_channel_join():
    """
        HTTP Route: /channels/join
        HTTP Method: POST
        Params: (token, channel_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    printColour("Channel Join: {}".format(request_data), colour="violet")
    return jsonify(channels.channels_join(token, channel_id))

@channels_router.route("/channels/addowner", methods=['POST'])
def handle_channel_add_owner():
    """
        HTTP Route: /channels/addowner
        HTTP Method: POST
        Params: (token, channel_id, user_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    user_id = int(request_data["user_id"])
    printColour("Channel Add Owner: {}".format(request_data), colour="violet")
    return jsonify(channels.channels_addowner(token, channel_id, user_id))

@channels_router.route("/channels/removeowner", methods=['POST'])
def handle_channel_remove_owner():
    """
        HTTP Route: /channels/removeowner
        HTTP Method: POST
        Params: (token, channel_id, user_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    user_id = int(request_data["user_id"])
    printColour("Channel Remove Owner: {}".format(request_data), colour="violet")
    return jsonify(channels.channels_removeowner(token, channel_id, user_id))

@channels_router.route("/channels/list", methods=['GET'])
def handle_channels_list():
    """
        HTTP Route: /channels/list
        HTTP Method: GET
        Params: (token)
        Returns JSON: { 
            channels: [{ channel_id, name, description, visibility }, ...]
        }
    """
    token = request.args.get("token")
    printColour("Channels List: {}".format(request.args), colour="violet")
    return jsonify({})

@channels_router.route("/channels/listall", methods=['GET'])
def handle_channels_listall():
    """
        HTTP Route: /channels/listall
        HTTP Method: GET
        Params: (token)
        Returns JSON: {
            channels: [{ channel_id, name, description, visibility, member_of, owner_of }, ...]
        }
    """
    token = request.args.get("token")
    printColour("Channels Listall: {}".format(request.args), colour="violet")
    return jsonify(channels.channels_listall(token))

@channels_router.route("/channels/create", methods=['POST'])
def handle_channels_create():
    """
        HTTP Route: /channels/create
        HTTP Method: POST
        Params: (token, name, description, visibility)
        Returns JSON: {
            channels_id
        }
    """
    request_data = request.get_json()
    token = request_data["token"]
    name = request_data["name"]
    description = request_data["description"]
    visibility = request_data["visibility"]
    printColour("Channels Create: {}".format(request_data), colour="violet")
    return jsonify(channels.channels_create(token, name, description, visibility))
