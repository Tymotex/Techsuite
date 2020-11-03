# Third party libraries
from flask import Blueprint, request, jsonify

# Local imports:
from authentication import auth_signup, auth_login, auth_logout, auth_password_reset, auth_password_reset_request
from util.util import printColour, get_user_from_id

from exceptions import InputError

auth_router = Blueprint("auth", __name__)

@auth_router.route("/auth/register", methods=['POST'])
def handle_auth_signup():
    """
        HTTP Route: /auth/register
        HTTP Method: POST
        Params: (email, username, password)
        Returns JSON: { token, user_id, username, profile_img_url }
    """
    request_data = request.get_json()
    email = request_data["email"]
    password = request_data["password"]
    username = request_data["username"]
    printColour(" ➤ Signed up: {}, {}".format(username, email), colour="blue")
    return jsonify(auth_signup(email, password, username))

@auth_router.route("/auth/login", methods=['POST'])
def handle_auth_login():
    """
        HTTP Route: /auth/login
        HTTP Method: POST
        Params: (email, password)
        Returns JSON: { token, user_id, username, profile_img_url }
    """
    request_data = request.get_json()
    email = request_data["email"]
    password = request_data['password']
    printColour(" ➤ Logged in: {}".format(email), colour="blue")
    return jsonify(auth_login(email, password))

@auth_router.route("/auth/logout", methods=['POST'])
def handle_auth_logout():
    """
        HTTP Route: /auth/logout
        HTTP Method: POST
        Params: (token)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    printColour(" ➤ Logged out: {}".format(request_data["token"]), colour="blue")
    return jsonify(auth_logout(request_data["token"]))

@auth_router.route("/auth/forgotpassword/request", methods=['POST'])
def handle_auth_password_request():
    """
        HTTP Route: /auth/passwordreset/request
        HTTP Method: POST
        Params: (email)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    results = auth_password_reset_request(request_data["email"])
    printColour(" ➤ Reset password request: {}".format(request_data), colour="blue")
    return jsonify(results)

@auth_router.route("/auth/forgotpassword/reset", methods=['POST'])
def handle_auth_passwordreset_reset():
    """
        HTTP Route: /auth/passwordreset/reset
        HTTP Method: POST
        Params: (reset_code, new_password)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    reset_code = request_data['reset_code']
    new_password = request_data['new_password']
    printColour(" ➤ Password reset: {}".format(request_data), colour="blue")
    return jsonify(auth_password_reset(reset_code, new_password))
