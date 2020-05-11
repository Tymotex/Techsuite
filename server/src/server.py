import pprint
import os
from json import dumps
from PIL import Image
import requests
from flask import Flask, request, send_file, jsonify, Blueprint
from flask_cors import CORS
from exceptions import InputError
from pprint import pprint
from dotenv import load_dotenv

# Routes
from routes.auth_routes import auth_router
from routes.channels_routes import channels_router

# Source files
import messages
import users
from database import get_data, show_data

# Globals and config
load_dotenv()
PROFILE_IMG_DIRECTORY = os.getcwd() + r"/static/images/"
APP = Flask(__name__)

# Allowing cross-origin resource sharing
CORS(APP)

# Importing modularised routes:
APP.register_blueprint(auth_router)
APP.register_blueprint(channels_router, url_prefix="/channels")


def default_handler(err):
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



APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, default_handler)


# ============== Helper Function ==============
def download_img_and_crop(url, u_id, x_start, y_start, x_end, y_end):
    """
    Given a URL to an web image resource, download it to the
    project directory's 'static/images' folder with a unique filename.
    The image is then cropped and overwritten by the cropped result.

    Parameters:
    url         str
    u_id        int
    x_start     int
    y_start     int
    x_end       int
    y_end       int

    Returns the filename of the cropped image on success, otherwise
    returns None
    """
    filename = "user{}_profile.jpg".format(u_id)
    image_path = PROFILE_IMG_DIRECTORY + filename

    # Fetching and saving the profile picture to server directory
    res = requests.get(url)
    if res.status_code != 200:
        raise InputError(description="Request to image resource failed")
    with open(image_path, "wb") as output_img:
        output_img.write(res.content)

    try:
        pic = Image.open(image_path)
    except:
        raise InputError(description="Not a valid image file!")

    # Remove the previous profile picture, if it exists
    try:
        os.remove(image_path)
    except FileNotFoundError:
        pass

    crop_coordinates = (x_start, y_start, x_end, y_end)
    width, height = pic.size
    if (x_start > width or y_start > height or
            x_end > width or y_end > height or
            x_start < 0 or y_start < 0 or
            x_end < 0 or y_end < 0 or
            x_start > x_end or y_start > y_end
       ):
        raise InputError(description="Coordinates out of bounds")

    cropped_pic = pic.crop(crop_coordinates)
    cropped_pic.save(image_path)
    return filename

@APP.route("/", methods=["GET"])
def index():
    return "Index page"

@APP.route("/message/send", methods=['POST'])
def handle_message_send():
    """
    HTTP Route: /message/send
    HTTP Method: POST
    Params: (token, channel_id, message)

    Return dumps(results)   (str)
    """
    print("*** SENDING MESSAGE ***")
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    sent_message = request_data["message"]
    results = messages.message_send(token, channel_id, sent_message)
    return dumps(results)

@APP.route("/message/sendlater", methods=['POST'])
def handle_message_sendlater():
    """
    HTTP Route: /message/sendlater
    HTTP Method: POST
    Params: (token, channel_id, message, time_sent)

    Return dumps(results)   (str)
    """
    print("MESSAGE SENDLATER:")
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    send_message_later = request_data["message"]
    time_sent = int(request_data["time_sent"])
    results = messages.message_sendlater(token, channel_id, send_message_later, time_sent)
    return dumps(results)

@APP.route("/message/react", methods=['POST'])
def handle_message_react():
    """
    HTTP Route: /message/react
    HTTP Method: POST
    Params: (token, message_id, react_id)

    Return dumps(results)   (str)
    """
    print("MESSAGE REACT:")
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    react_id = int(request_data["react_id"])
    results = messages.message_react(token, message_id, react_id)
    return dumps(results)

@APP.route("/message/unreact", methods=['POST'])
def handle_message_unreact():
    """
    HTTP Route: /message/unreact
    HTTP Method: POST
    Params: (token, message_id, react_id)

    Return dumps(results)   (str)
    """
    print("MESSAGE UNREACT:")
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    react_id = int(request_data["react_id"])
    results = messages.message_unreact(token, message_id, react_id)
    return dumps(results)

@APP.route("/message/pin", methods=['POST'])
def handle_message_pin():
    """
    HTTP Route: /message/pin
    HTTP Method: POST
    Params: (token, message_id)

    Return dumps(results)   (str)
    """
    print("MESSAGE PIN:")
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    results = messages.message_pin(token, message_id)
    return dumps(results)

@APP.route("/message/unpin", methods=['POST'])
def handle_message_unpin():
    """
    HTTP Route: /message/unpin
    HTTP Method: POST
    Params: (token, message_id)

    Return dumps(results)   (str)
    """
    print("MESSAGE UNPIN:")
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    results = messages.message_unpin(token, message_id)
    return dumps(results)

@APP.route("/message/remove", methods=['DELETE'])
def handle_message_remove():
    """
    HTTP Route: /message/remove
    HTTP Method: DELETE
    Params: (token, message_id)

    Return dumps(results)   (str)
    """
    print("MESSAGE REMOVE:")
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    results = messages.message_remove(token, message_id)
    return dumps(results)

@APP.route("/message/edit", methods=['PUT'])
def handle_message_edit():
    """
    HTTP Route: /message/edit
    HTTP Method: PUT
    Params: (token, message_id, message)

    Return dumps(results)   (str)
    """
    print("MESSAGE EDIT:")
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    edited_message = request_data["message"]
    results = messages.message_edit(token, message_id, edited_message)
    return dumps(results)

@APP.route("/users/profile", methods=['GET'])
def handle_user_profile():
    """
    HTTP Route: /users/profile
    HTTP Method: GET
    Params: (token, u_id)

    Return dumps(results)   (str)
    """
    print("*** USER PROFILE ***")
    token = request.args.get("token")
    u_id = int(request.args.get("u_id"))
    results = users.users_profile(token, u_id)
    return dumps(results)

@APP.route("/users/profile/setname", methods=['PUT'])
def handle_user_profile_setname():
    """
    HTTP Route: /users/profile/setname
    HTTP Method: PUT
    Params: (token, name_first, name_last)

    Return dumps(results)   (str)
    """
    print("USER PROFILE SETNAME:")
    request_data = request.get_json()
    token = request_data["token"]
    name_first = request_data["name_first"]
    name_last = request_data["name_last"]
    results = users.users_profile_setname(token, name_first, name_last)
    return dumps(results)

# Params: (token, email)
@APP.route("/users/profile/setemail", methods=['PUT'])
def handle_user_profile_setemail():
    """
    HTTP Route: /users/profile/setemail
    HTTP Method: PUT
    Params: (token, email)

    Return dumps(results)   (str)
    """
    print("USER PROFILE SETEMAIL:")
    request_data = request.get_json()
    token = request_data["token"]
    email = request_data["email"]
    results = users.users_profile_setemail(token, email)
    return dumps(results)

@APP.route("/images/<filename>")
def serve_image(filename):
    """ Given an image filename, serves that image back with Flask's send_file """
    return send_file("static/images/{}".format(filename))

@APP.route("/users/profileimage")
def get_profile_image_url():
    """ Returns the URL to the requesting user's profile picture """
    results = users.users_get_profile_image_url(request.args.get("token"))
    return dumps(results)

# Params: (token, img_url, x_start, y_start, x_end, y_end)
@APP.route("/users/profile/uploadphoto", methods=['POST'])
def handle_user_profile_uploadphoto():
    """
    HTTP Route: /users/profile/uploadphoto
    HTTP Method: POST
    Params: (token, img_url, x_start, y_start, x_end, y_end)

    Return dumps(results)   (str)
    """
    print("=====USER PROFILE UPLOADPHOTO =====")
    request_data = request.get_json()
    token = request_data["token"]
    img_url = request_data["img_url"]
    x_start = int(request_data["x_start"])
    y_start = int(request_data["y_start"])
    x_end = int(request_data["x_end"])
    y_end = int(request_data["y_end"])
    print("===> URL: " + img_url)
    data = other.get_data()
    u_id = other.get_user_from_token(data, token)["u_id"]
    img_filename = download_img_and_crop(img_url, u_id, x_start, y_start, x_end, y_end)

    port = os.getenv("PORT")
    image_endpoint = "http://localhost:{0}/images/{1}".format(port, img_filename)

    results = users.users_profile_uploadphoto(token, image_endpoint)
    return dumps(results)

@APP.route("/userss/all", methods=['GET'])
def handle_users_all():
    """
    HTTP Route: /userss/all
    HTTP Method: GET
    Params: (token)

    Return dumps(results)   (str)
    """
    print("USERS ALL:")
    token = request.args.get("token")
    results = other.users_all(token)
    return dumps(results)

@APP.route("/search", methods=['GET'])
def handle_search():
    """
    HTTP Route: /search
    HTTP Method: GET
    Params: (token, query_str)

    Return dumps(results)   (str)
    """
    print("SEARCH:")
    token = request.args.get("token")
    query_str = request.args.get("query_str")
    results = other.search(token, query_str)
    return dumps(results)

@APP.route("/admin/users/remove", methods=["POST"])
def handle_admin_user_remove():
    """
    HTTP Route: /admin/users/remove
    HTTP Method: DELETE
    Params: (token, u_id)

    Return dumps(results)   (str)
    """
    print("ADMIN USER REMOVE:")
    request_data = request.get_json()
    pprint.pprint(request_data, width=100)
    token = request_data["token"]
    u_id = int(request_data["u_id"])
    results = other.admin_user_remove(token, u_id)
    return dumps(results)

@APP.route("/admin/userspermission/change", methods=['POST'])
def handle_admins_userpermission_change():
    """
    HTTP Route: /admin/userspermission/change
    HTTP Method: POST
    Params: (token, u_id, permission_id)

    Return dumps(results)   (str)
    """
    print("ADMIN USERPERMISSION CHANGE:")
    request_data = request.get_json()
    token = request_data["token"]
    u_id = int(request_data["u_id"])
    permission_id = int(request_data["permission_id"])
    results = other.admin_userpermission_change(token, u_id, permission_id)
    return dumps(results)

@APP.route("/workspace/reset", methods=['POST'])
def handle_workspace_reset():
    """
    HTTP Route: /workspace/reset
    HTTP Method: POST
    Params: ()

    Return dumps(results)   (str)
    """
    print("WORKSPACE RESET:")
    other.workspace_reset()
    return dumps({})

# For debugging and testing
@APP.route("/workspace/show", methods=["GET"])
def handle_workspace_show():
    data_store = get_data()
    print("============== SHOWING DATA ==============")
    show_data(data_store)
    print("============== DONE SHOWING ==============")
    return dumps(data_store)

if __name__ == "__main__":
    # The port is specified in the .env file (which is parsed and loaded by the python-dotenv module)
    APP.run(port=os.getenv("PORT"), debug=True)
