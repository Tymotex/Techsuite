from flask import Blueprint, request, jsonify
from util.util import printColour, crop_image_file, get_latest_filename
from dotenv import load_dotenv
import os
from exceptions import InputError

# Globals and config:
load_dotenv()
connections_router = Blueprint("channels", __name__)
BASE_URL = "http://localhost:{0}".format(os.getenv("PORT"))

@connections_router.route("/connections/request", methods=['POST'])
def handle_conection_request():
    """
        HTTP Route: /connections/request
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: {  }
    """
    return jsonify({})

@connections_router.route("/connections/add", methods=['POST'])
def handle_conection_add():
    """
        HTTP Route: /connections/add
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: {  }
    """
    return jsonify({})

@connections_router.route("/connections/remove", methods=['POST'])
def handle_conection_add():
    """
        HTTP Route: /connections/remove
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: {  }
    """
    return jsonify({})

# ===== Sending Messages =====

@connections_router.route("/connections/sendmessage", methods=['POST'])
def handle_conection_add():
    """
        HTTP Route: /connections/sendmessage
        HTTP Method: POST
        Params: (token, user_id, message)
        Returns JSON: {  }
    """
    return jsonify({})

@connections_router.route("/connections/details", methods=['POST'])
def handle_conection_add():
    """
        HTTP Route: /connections/sendmessage
        HTTP Method: POST
        Params: (token, user_id)
        Returns JSON: { messages }
    """
    return jsonify({})
