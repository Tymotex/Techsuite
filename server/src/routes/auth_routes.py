from flask import Blueprint, request, jsonify
from authentication import auth_register, auth_login, auth_logout, auth_password_reset, auth_password_reset_request

auth_router = Blueprint("auth", __name__)

@auth_router.route("/auth/login", methods=['POST'])
def handle_auth_login():
    """
        HTTP Route: /auth/login
        HTTP Method: POST
        Params: (email, password)
        Returns JSON: { token, u_id }
    """
    request_data = request.get_json()
    email = request_data["email"]
    password = request_data['password']
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
    return jsonify(auth_logout(request_data["token"]))

@auth_router.route("/auth/register", methods=['POST'])
def handle_auth_register():
    """
        HTTP Route: /auth/register
        HTTP Method: POST
        Params: (email, password, name_first, name_last)
        Returns JSON: { token, u_id }
    """
    request_data = request.get_json()
    email = request_data["email"]
    password = request_data['password']
    name_first = request_data["name_first"]
    name_last = request_data["name_last"]
    return jsonify(auth_register(email, password, name_first, name_last))

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
    return jsonify(auth_password_reset(reset_code, new_password))
