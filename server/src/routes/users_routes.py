from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import os
import users

# Globals and config:
load_dotenv()
users_router = Blueprint("users", __name__)

@users_router.route("/users/profile", methods=['GET'])
def handle_user_profile():
    """
        HTTP Route: /users/profile
        HTTP Method: GET
        Params: (token, u_id)
        Returns JSON: { 
            u_id, email, name_first, name_last, profile_img_url
        }
    """
    token = request.args.get("token")
    u_id = int(request.args.get("u_id"))
    return jsonify(users.users_profile(token, u_id))

@users_router.route("/users/profile/setname", methods=['PUT'])
def handle_user_profile_setname():
    """
        HTTP Route: /users/profile/setname
        HTTP Method: PUT
        Params: (token, name_first, name_last)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    name_first = request_data["name_first"]
    name_last = request_data["name_last"]
    return jsonify(users.users_profile_setname(token, name_first, name_last))

# Params: (token, email)
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
            users: { u_id, email, name_first, name_last, profile_img_url }
        }
    """
    token = request.args.get("token")
    return jsonify(other.users_all(token))

# ===== User Profile Picture Handling =====
@users_router.route("/users/profileimage")
def get_profile_image_url():
    """ Returns the URL to the requesting user's profile picture """
    return jsonify(users.users_get_profile_image_url(request.args.get("token")))

@users_router.route("/users/profile/uploadphoto", methods=['POST'])
def handle_user_profile_uploadphoto():
    """
        HTTP Route: /users/profile/uploadphoto
        HTTP Method: POST
        Params: (token, img_url, x_start, y_start, x_end, y_end)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    img_url = request_data["img_url"]
    x_start = int(request_data["x_start"])
    y_start = int(request_data["y_start"])
    x_end = int(request_data["x_end"])
    y_end = int(request_data["y_end"])
    data = other.get_data()
    u_id = other.get_user_from_token(data, token)["u_id"]
    img_filename = download_img_and_crop(img_url, u_id, x_start, y_start, x_end, y_end)

    image_endpoint = "http://localhost:{0}/images/{1}".format(os.getenv("port"), img_filename)

    return jsonify(users.users_profile_uploadphoto(token, image_endpoint))
