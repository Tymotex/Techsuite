from flask import Blueprint, request, jsonify
from util.util import printColour, crop_image_file, get_latest_filename
import channels
from dotenv import load_dotenv
import os
from exceptions import InputError

# Globals and config:
load_dotenv()
channels_router = Blueprint("channels", __name__)
BASE_URL = "http://localhost:{0}".format(os.getenv("PORT"))

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
        Returns JSON: { name, description, visibility, channel_img_url, owner_members, all_members }
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

# TODO: Is this deprecated?
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
    if not name or not visibility:
        raise InputError("Channel name or visibility not specified")
    return jsonify(channels.channels_create(token, name, description, visibility))

@channels_router.route("/channels/update", methods=['PUT'])
def handle_channels_update_info():
    """
        HTTP Route: /channels/update
        HTTP Method: PUT
        Params: (token, channel_id, name, description, visibility)
        Returns JSON: { succeeded }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = request_data["channel_id"]
    name = request_data["name"]
    description = request_data["description"]
    visibility = request_data["visibility"]
    channels.channels_update_info(token, channel_id, name, description, visibility)
    return { "succeeded": True }

# ===== User Profile Picture Handling =====

from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.getcwd() + r"/src/static/images/"        # TODO: Not robust? Cwd should always be project root
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@channels_router.route("/channels/uploadimage", methods=['POST'])
def handle_channels_upload_image():
    """
        HTTP Route: /channels/uploadimage
        HTTP Method: POST
        Params: (token, channel_id, x_start, y_start, x_end, y_end, file)
    """
    token = request.form["token"]
    channel_id = request.form["channel_id"]
    x_start = int(request.form["x_start"])
    y_start = int(request.form["y_start"])
    x_end = int(request.form["x_end"])
    y_end = int(request.form["y_end"])

    printColour("Uploading channel image to channel with ID: " + channel_id)

    # Check if the post request has the file part
    if 'file' not in request.files:
        printColour("No channel image uploaded?")
        raise InputError("No valid image file found. Please try again")
    else:
        printColour("Saving channel photo")
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = get_latest_filename("channel_{}_profile.jpg".format(channel_id))
            printColour("Filename: " + filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            crop_image_file(filename, x_start, y_start, x_end, y_end)
            image_endpoint = "{0}/images/{1}".format(BASE_URL, filename)
            channels.channels_upload_photo(token, channel_id, image_endpoint)
            return jsonify({ "succeeded": True })

@channels_router.route("/channels/uploadcover", methods=['POST'])
def handle_channels_upload_cover():
    """
        HTTP Route: /channels/uploadcover
        HTTP Method: POST
        Params: (token, channel_id, file)
    """
    token = request.form["token"]
    channel_id = request.form["channel_id"]

    printColour("Uploading channel cover to channel with ID: " + channel_id)

    # Check if the post request has the file part
    if 'file' not in request.files:
        printColour("No channel image uploaded?")
        raise InputError("No valid image file found. Please try again")
    else:
        printColour("Saving channel photo")
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = get_latest_filename("channel_{}_profile.jpg".format(channel_id))
            printColour("Filename: " + filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            image_endpoint = "{0}/images/{1}".format(BASE_URL, filename)
            channels.channels_upload_cover(token, channel_id, image_endpoint)
            return jsonify({ "succeeded": True })
