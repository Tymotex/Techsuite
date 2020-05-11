from flask import Blueprint, request, jsonify
import messages

message_router = Blueprint("message", __name__)

@messages_router.route("/message/send", methods=['POST'])
def handle_message_send():
    """
        HTTP Route: /message/send
        HTTP Method: POST
        Params: (token, channel_id, message)
        Returns JSON: {
            message_id
        }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    sent_message = request_data["message"]
    return jsonify(messages.message_send(token, channel_id, sent_message))

@messages_router.route("/message/sendlater", methods=['POST'])
def handle_message_sendlater():
    """
        HTTP Route: /message/sendlater
        HTTP Method: POST
        Params: (token, channel_id, message, time_sent)
        Returns JSON: {
            message_id
        }
    """
    request_data = request.get_json()
    token = request_data["token"]
    channel_id = int(request_data["channel_id"])
    send_message_later = request_data["message"]
    time_sent = int(request_data["time_sent"])
    return jsonify(messages.message_sendlater(token, channel_id, send_message_later, time_sent))

@messages_router.route("/message/react", methods=['POST'])
def handle_message_react():
    """
        HTTP Route: /message/react
        HTTP Method: POST
        Params: (token, message_id, react_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    react_id = int(request_data["react_id"])
    return jsonify(messages.message_react(token, message_id, react_id))

@messages_router.route("/message/unreact", methods=['POST'])
def handle_message_unreact():
    """
        HTTP Route: /message/unreact
        HTTP Method: POST
        Params: (token, message_id, react_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    react_id = int(request_data["react_id"])
    return jsonify(messages.message_unreact(token, message_id, react_id))

@messages_router.route("/message/pin", methods=['POST'])
def handle_message_pin():
    """
        HTTP Route: /message/pin
        HTTP Method: POST
        Params: (token, message_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    return jsonify(messages.message_pin(token, message_id))

@messages_router.route("/message/unpin", methods=['POST'])
def handle_message_unpin():
    """
        HTTP Route: /message/unpin
        HTTP Method: POST
        Params: (token, message_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    return jsonify(messages.message_unpin(token, message_id))

@messages_router.route("/message/remove", methods=['DELETE'])
def handle_message_remove():
    """
        HTTP Route: /message/remove
        HTTP Method: DELETE
        Params: (token, message_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    return jsonify(messages.message_remove(token, message_id))

@messages_router.route("/message/edit", methods=['PUT'])
def handle_message_edit():
    """
        HTTP Route: /message/edit
        HTTP Method: PUT
        Params: (token, message_id, message)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    message_id = int(request_data["message_id"])
    edited_message = request_data["message"]
    return jsonify(messages.message_edit(token, message_id, edited_message))

# ===== Message Searching =====
@messages_router.route("/search", methods=['GET'])
def handle_search():
    """
    HTTP Route: /search
    HTTP Method: GET
    Params: (token, query_str)
    Returns JSON: {
        messages: [{ message_id, u_id, message, time_created, reacts, is_pinned }, ...]
    }
    """
    token = request.args.get("token")
    query_str = request.args.get("query_str")
    return jsonify(other.search(token, query_str))
