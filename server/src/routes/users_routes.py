# Standard libraries:
import os

# Third party libraries:
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

# Local imports:
import users
from util import get_user_from_token, printColour, download_img_and_get_filename

# Globals and config:
load_dotenv()
users_router = Blueprint("users", __name__)
BASE_URL = "http://localhost:{0}".format(os.getenv("PORT"))

@users_router.route("/users/profile", methods=['GET'])
def handle_user_profile():
    """
        HTTP Route: /users/profile
        HTTP Method: GET
        Params: (token, user_id)
        Returns JSON: { user_id, email, username, profile_img_url }
    """
    token = request.args.get("token")
    user_id = int(request.args.get("user_id"))
    printColour("User profile: {}".format(request.args), colour="violet")
    return jsonify(users.users_profile(token, user_id))

@users_router.route("/users/profile/setemail", methods=['PUT'])
def handle_user_profile_setemail():
    """
        HTTP Route: /users/profile/setemail
        HTTP Method: PUT
        Params: (token, email)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    email = request_data["email"]
    return jsonify(users.users_profile_setemail(token, email))

@users_router.route("/users/all", methods=['GET'])
def handle_users_all():
    """
        HTTP Route: /users/all
        HTTP Method: GET
        Params: (token)
        Returns JSON: {
            users: [{ user_id, email, username, profile_img_url }, ...]
        }
    """
    token = request.args.get("token")
    printColour("All Users: {}".format(request.args), colour="violet")
    return jsonify(users.users_all(token))

# ===== User Profile Picture Handling =====
# @users_router.route("/users/profileimage")
# def get_profile_image_url():
#     """
#         TODO: Deprecated?
#         Returns the URL to the requesting user's profile picture
#     """
#     return jsonify(users.users_get_profile_image_url(request.args.get("token")))

@users_router.route("/users/profile/uploadphoto", methods=['POST'])
def handle_user_profile_upload_photo():
    """
        HTTP Route: /users/profile/uploadphoto
        HTTP Method: POST
        Params: (token, img_url)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    img_url = request_data["img_url"]
    user_id = get_user_from_token(token).id
    img_filename = download_img_and_get_filename(img_url, user_id)
    image_endpoint = "{0}/images/{1}".format(BASE_URL, img_filename)
    printColour("Uploading user profile: {}".format(request_data), colour="violet")
    return jsonify(users.users_profile_upload_photo(token, image_endpoint))
