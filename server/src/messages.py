# Source files:
from extensions import db
from models import Channel, User, Message, MemberOf, Bio
from exceptions import InputError, AccessError
from util.util import is_user_member, get_message, determine_channel, select_channel
from util.token import verify_token, get_user_from_token

def message_send(token, channel_id, message):
    """
        Sends a message to the selected channel.
        Parameters:
            token      (str)
            channel_id (int)
            message    (str)
        Returns: 
            { message_id }
    """
    verify_token(token)
    if len(message) > 1000:
        raise InputError(description="Message is over 1000 characters")
    user = get_user_from_token(token)
    selected_channel = select_channel(channel_id)
    # Raise error if the user is not a part of the channel they are trying to message in
    if not is_user_member(user, selected_channel):
        raise AccessError(description="User is not a member of channel with channel_id")

    sent_message = Message(
        channel=selected_channel,
        user=user,
        message=message
    )
    db.session.add(sent_message)
    db.session.commit()
    return {
        "message_id": sent_message.id
    }

# TODO
def message_remove(token, message_id):
    """
        Removes a message from the list of messages
        Returns:
            {}  dict
    """
    if verify_token(token) is False:
        raise AccessError(description="Invalid Token")

    # Gets message details, returns None if message doesnt exist
    selected_message = get_message(data, message_id)
    if selected_message is None:
        raise InputError(description="Message no longer exists")

    selected_channel = determine_channel(data, message_id)

    # Checks if user is in the list of owners
    user = get_user_from_token(data, token)
    is_user_owner = is_owner(selected_channel, user)

    # Checks if user is a global owner (admin)
    is_user_admin = is_admin(data, user)

    # User can only remove their own messages if not an owner or admin
    # Owners or admins can delete anyones message
    if selected_message["user_id"] != user["user_id"]:
        if is_user_owner is False:
            if is_user_admin is False:
                raise AccessError(description="User is not an owner or admin")

    # Removes message and saves changes
    selected_channel["messages"].remove(selected_message)


    return {}

# TODO
def message_edit(token, message_id, message):
    """
        Edits an existing message. Deletes it if the new message is empty
        Returns:
            {}  dict
    """
    verify_token(token)

    if len(message) > 1000:
        raise InputError(description="Message over 1000 characters")

    # Locates message to be edited and channel it is in
    selected_channel = determine_channel(data, message_id)
    selected_message = get_message(data, message_id)

    # Determines whether user is an owner or not
    user = get_user_from_token(data, token)

    is_user_owner = is_owner(selected_channel, user)

    # Determines whether user is a global owner (admin)
    is_user_admin = is_admin(data, user)

    # User can only edit their own messages
    # Owners and admins can edit anyones message
    if selected_message["user_id"] != user["user_id"]:
        if is_user_owner is False:
            if is_user_admin is False:
                raise AccessError(description="User is not an owner or admin")

    # Deletes message if new message is an empty string.
    # Otherwise changes the message to the new message
    if message == "":
        selected_channel["messages"].remove(selected_message)

    selected_message["message"] = message

    return {}

# TODO
def search(token, query_str):
    """
        Given a query string, return a collection of messages in all of the channels
        that the user has joined that match the query. Results are sorted from most
        recent message to least recent message
        ERRORS
        - Invalid token
        Returns: {
            List of dictionaries, where each dictionary contains
            types { message_id, user_id, message, time_created, reacts, is_pinned  }
            messages    list(dict)
        }
    """
    verify_token(token)
    
    # For an empty string input, nothing happens and is returned
    if query_str == "":
        return None
    
    user = get_user_from_token(data, token)
    # Searches all messages and compares query_str
    search_results = []
    for selected_channel in data["channels"]:
        if is_user_member(user, selected_channel) is True:
            for message in reversed(selected_channel["messages"]):
                message_lower_case = message["message"].lower()
                string_checker = message_lower_case.find(query_str.lower())
                if string_checker >= 0:
                    search_results.append(message)
    sorted_messages = sorted(search_results, key=lambda k: k['time_created'])
    
    # Returns messages that contain query_str
    # Contains all info on message (message_id, user_id, message, time_created, reacts, pin)
    return {
        'messages': sorted_messages
    }
