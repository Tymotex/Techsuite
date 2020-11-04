import os
from extensions import db
from models import Channel, User, Message, MemberOf, Bio, Connection, DirectMessage
from exceptions import InputError, AccessError
from util.util import is_user_member, select_channel, get_user_from_id, printColour
from util.token import get_user_from_token, verify_token
from users import users_profile, users_bio_fetch

# ===== Fetching Connections =====

def connection_fetch_users(token):
    """
        Gets all the users that are connected with the calling user
        Parameters:
            token   (str)
        Returns: {
            "users": [ { user_id, email, username, profile_img_url }, ... ]
        }        
    """
    def package_user_info(user_id):
        package = users_profile(token, user_id)
        package.update(users_bio_fetch(token, user_id))
        return package
    verify_token(token)
    calling_user = get_user_from_token(token)
    # Get all the connected users that have been approved
    connected_user_ids = [ conn.other_user_id for conn in Connection.query.all() if (conn.user_id == calling_user.id and conn.approved) ]
    connected_users = list(map(package_user_info, connected_user_ids))
    return {
        "users": connected_users
    }

def connection_fetch_incoming_users(token):
    """
        Gets all the users that are connected with the calling user
        Parameters:
            token   (str)
        Returns: {
            "users": [ { user_id, email, username, profile_img_url }, ... ]
        }        
    """
    verify_token(token)
    calling_user = get_user_from_token(token)
    # Get all the connected users which have NOT been approved AND who this user
    # did NOT initiate the request with
    connected_user_ids = [ conn.other_user_id for conn in Connection.query.all() if (conn.user_id == calling_user.id and not conn.approved and not conn.is_requester) ]
    connected_users = list(map(lambda user_id: users_profile(token, user_id), connected_user_ids))
    return {
        "users": connected_users
    }

def connection_fetch_outgoing_users(token):
    """
        Gets all the users that are connected with the calling user
        Parameters:
            token   (str)
        Returns: {
            "users": [ { user_id, email, username, profile_img_url }, ... ]
        }        
    """
    verify_token(token)
    calling_user = get_user_from_token(token)
    # Get all the connected users that have NOT been approved AND who this user
    # DID initiate the request with
    connected_user_ids = [ conn.other_user_id for conn in Connection.query.all() if (conn.user_id == calling_user.id and not conn.approved and conn.is_requester) ]
    connected_users = list(map(lambda user_id: users_profile(token, user_id), connected_user_ids))
    return {
        "users": connected_users
    }

# ===== Connections Operations =====

def connection_request(token, user_id):
    """
        Adds a pending connection request to the target user_id
        Parameters:
            token   (str)
            user_id (int)
        Returns:
            {}      (dict)
    """
    verify_token(token)
    this_user = get_user_from_token(token)

    # Check if the connection object already exists
    connection_obj = Connection.query.filter_by(user_id=this_user.id, other_user_id=user_id).first()
    if connection_obj:
        description = "You are already connected with this person" if connection_obj.approved else "Connection request has already been made" 
        raise InputError(description)
    # Can't make connection requests to yourself
    if this_user.id == user_id:
        raise InputError("You can't connect with yourself")

    # Add a connection object to both users and set the approved attribute to false,
    # indicating that the connection is pending
    this_user_conn = Connection(
        user_id=this_user.id,
        other_user_id=user_id,
        approved=False,
        is_requester=True
    )
    other_user_conn = Connection(
        user_id=user_id,
        other_user_id=this_user.id,
        approved=False,
        is_requester=False
    )
    db.session.add(this_user_conn)
    db.session.add(other_user_conn)
    db.session.commit()
    return {}

def connection_accept(token, user_id):
    """
        Approves a pending connection 
        Parameters:
            token         (str)
            user_id       (int)
        Returns:
            {}            (dict)
    """
    verify_token(token)
    this_user = get_user_from_token(token)
    connections = Connection.query.all()

    # Fetch the connection object in both users and set the approved attribute to true
    for each_connection in connections:
        if each_connection.user_id == this_user.id and each_connection.other_user_id == user_id:
            each_connection.approved = True
        elif each_connection.user_id == user_id and each_connection.other_user_id == this_user.id:
            each_connection.approved = True

    db.session.commit()
    return {}

def connection_remove(token, user_id):
    """
        Drops a pending/existing connection
        Parameters:
            token         (str)
            user_id        (int)
        Returns:
            {}            (dict)
    """
    verify_token(token)
    this_user = get_user_from_token(token)
    connections = Connection.query.all()
    for each_connection in connections:
        if each_connection.user_id == this_user.id and each_connection.other_user_id == user_id:
            for each_message in DirectMessage.query.filter_by(connection_id=each_connection.id):
                connection_remove_message(token, each_message.id)
            db.session.delete(each_connection)
        elif each_connection.user_id == user_id and each_connection.other_user_id == this_user.id:
            for each_message in DirectMessage.query.filter_by(connection_id=each_connection.id):
                connection_remove_message(token, each_message.id)
            db.session.delete(each_connection)
    db.session.commit()
    return {}

# ===== Message Handling =====

def connection_fetch_messages(token, user_id):
    """
        Fetches all messages between the calling user and the other user
        Parameters:
            token         (str)
            user_id       (int)
        Returns:
            { messages }  (dict)
        Where:
            messages: { message, sender_id }
    """
    verify_token(token)
    this_user = get_user_from_token(token)
    connections = Connection.query.all()
    for each_connection in connections:
        if (each_connection.user_id == this_user.id and each_connection.other_user_id == user_id) or \
           (each_connection.user_id == user_id and each_connection.other_user_id == this_user.id):
            return { 
                "messages": [
                    {
                        "message_id": each_msg.id,
                        "message": each_msg.message, 
                        "sender_id": each_msg.sender_id,
                        "time_created": each_msg.time_created.timestamp() 
                    } for each_msg in each_connection.messages_sent ]
            }
    return { "messages": [] }

def connection_send_message(token, user_id, message):
    """
        Sends a message from the calling user to the target user
        Parameters:
            token         (str)
            user_id       (int)
            message       (str)
        Returns:
            {}            (dict)
    """
    verify_token(token)
    this_user = get_user_from_token(token)
    connections = Connection.query.all()
    for each_connection in connections:
        if (each_connection.user_id == this_user.id and each_connection.other_user_id == user_id) or \
           (each_connection.user_id == user_id and each_connection.other_user_id == this_user.id):
            dm = DirectMessage(
                sender_id=this_user.id,
                connection_id=each_connection.id,
                message=message,
                connection=each_connection
            )
            db.session.add(dm)
            db.session.commit()
            return {}
    raise InputError("Broken connection between you and the recipient")


def connection_edit_message(token, message_id, message):
    """
        Drops a pending/existing connection
        Parameters:
            token         (str)
            message_id        (int)
        Returns:
            {}            (dict)
    """
    verify_token(token)
    this_user = get_user_from_token(token)
    target_dm = DirectMessage.query.filter_by(id=message_id).first()
    target_dm.message = message
    db.session.commit()
    return {}

def connection_remove_message(token, message_id):
    """
        Drops a pending/existing connection
        Parameters:
            token         (str)
            message_id        (int)
        Returns:
            {}            (dict)
    """
    verify_token(token)
    this_user = get_user_from_token(token)
    target_dm = DirectMessage.query.filter_by(id=message_id).first()
    db.session.delete(target_dm)
    db.session.commit()
    return {}
