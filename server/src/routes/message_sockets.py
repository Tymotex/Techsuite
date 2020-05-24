# from flask import Blueprint
# from flask_socketio import send, emit

# message_socket_handler = Blueprint("msg_sockets", __name__)

# # ===== Web Socket Messaging =====
# @socketio.on('connect')
# def handle_connect():
#     printColour("Socket connection succeeded")

# @socketio.on('message')
# def handle_message(message):
#     printColour("Received a message: {}".format(message))

# @socketio.on("send_message")
# def handle_send_message(token, channel_id, message):    
#     message_send(token, int(channel_id), message)
#     # Broadcast the newly sent message to all listening client sockets so the
#     # chat field updates in 'realtime'
#     emit("receive_message", "The server says hi", broadcast=True)
