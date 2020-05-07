"""
Contains all message functions (send, sendlater, react, unreact, pin, unpin, remove and edit)
"""
from datetime import datetime, timezone
import threading
import time

# Source files:
from database import get_data, save_data, generate_m_id, get_user_from_token
from exceptions import InputError, AccessError
from util import is_user_member, get_message, determine_channel, select_channel, is_owner, is_admin, verify_token

def message_send(token, channel_id, msg):
    """
    Sends a message to the selected channel
    Returns: {
        message_id  int
    }
    """
    verify_token(token)
    # Message must be below 1000 characters
    if len(msg) > 1000:
        raise InputError(description="Message is over 1000 characters")

    data = get_data()
    m_id = int(generate_m_id(data))
    user = get_user_from_token(data, token)
    u_id = user["u_id"]
    selected_channel = select_channel(data, channel_id)
    
    # Raise error if the user is not a part of the channel they are trying to message in
    if is_user_member(user, selected_channel) is False:
        raise AccessError(description="User is not a member of channel with channel_id")

    # Stamp the time on the message
    time_now = datetime.now()
    time_sent = time_now.replace(tzinfo=timezone.utc).timestamp()

    # Creat dictionary containing details of message
    sent_message = {
        "message_id": m_id,
        "u_id": u_id,
        "message": msg,
        "time_created": time_sent,
        "reacts": [{
            "react_id": 1,
            "u_ids": [],
            "is_this_user_reacted": False,
        }],
        "is_pinned": False,
    }
    # Adds message with its details to the selected channels list of messages
    selected_channel["messages"].insert(0, sent_message)
    
    save_data(data)
    return {
        "message_id": m_id
    }

def message_sendlater(token, channel_id, msg, time_sent):
    """
    Executes the message_send function after a given delay
    Returns: {
        message_id  int
    }
    """
    data = get_data()
    verify_token(token)

    # Raises error if message is over 1000 characters
    if len(msg) > 1000:
        raise InputError(description="Message is over 1000 characters")

    # Get current time and determine whether if time_sent is in the past. If it is, then raise an error
    time_now_dt = datetime.now()
    time_now = time_now_dt.replace(tzinfo=timezone.utc).timestamp()
    time_sent = datetime.fromtimestamp(time_sent)
    time_sent = time_sent.replace(tzinfo=timezone.utc).timestamp()
    if time_sent < time_now:
        raise InputError(description="Time sent is a time in the past!")

    # Collects channel details, returns None if id is invalid
    curr_channel = select_channel(data, channel_id)
    if not curr_channel:
        raise InputError(description="Invalid Channel ID")

    user = get_user_from_token(data, token)
    
    # Raise error if user is not a part of the channel they are trying to post to
    if is_user_member(user, curr_channel) is False:
        raise AccessError(description=f"User is not a member of channel")

    # Executes message_send after "time_delay" seconds
    time_delay = time_sent - time_now
    send_later = threading.Timer(time_delay, message_send, [token, curr_channel["channel_id"], msg])
    send_later.start()
    
    # TODO: Stops execution. Use threading? Is this a problem?
    time.sleep(time_delay + 0.1)

    # TODO: Spaghetti
    new_data = get_data()
    m_id = generate_m_id(new_data)

    return {
        "message_id": m_id - 1
    }

def message_react(token, message_id, react_id):
    """
    Adds a reaction to a message
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)

    # Checks if react_id is anything other than 1, the only valid react_id
    if react_id != 1:
        raise InputError(description="React ID not valid")

    # Retrieves message details, returns None if id is invalid
    selected_message = get_message(data, message_id)
    user = get_user_from_token(data, token)
    if selected_message is None:
        raise InputError(description="Message ID Invalid")

    # Checks if the user has already reacted to the message
    if selected_message["reacts"][0]["is_this_user_reacted"] is True:
        raise InputError(description="User has already reacted to this message")

    selected_message["reacts"][0]["u_ids"].append(user["u_id"])
    selected_message["reacts"][0]["is_this_user_reacted"] = True

    save_data(data)

    return {}

def message_unreact(token, message_id, react_id):
    """
    Removes a user's reaction from a message
    Parameters:
        token       str
        message_id  int
        react_id    int
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)

    # Checks if react_id is anything other than 1, the only valid react_id
    if react_id != 1:
        raise InputError(description="React ID not valid")

    # Gets message details, returns None if id is invalid
    selected_message = get_message(data, message_id)
    user = get_user_from_token(data, token)
    if selected_message is None:
        raise InputError(description="Message ID Invalid")

    # Checks if the user has actually reacted to the message
    if selected_message["reacts"][0]["is_this_user_reacted"] is False:
        raise InputError(description="Message does not contain an active reaction from the user")

    # Changes data in datastore. removes reaction
    selected_message["reacts"][0]["u_ids"].remove(user["u_id"])
    selected_message["reacts"][0]["is_this_user_reacted"] = False

    save_data(data)

    return {}

def message_pin(token, message_id):
    """
    Pins a user's message if they are authorised to do so
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)

    selected_message = get_message(data, message_id)
    selected_channel = determine_channel(data, message_id)
    if selected_message is None:
        raise InputError(description="Message ID Invalid")

    # Checks if user is a member in the channel
    user = get_user_from_token(data, token)
    if is_user_member(user, selected_channel) is False:
        raise AccessError(description=f"User is not a member of channel")

    # Checks if message is already pinned
    if selected_message["is_pinned"] is True:
        raise InputError(description="Message has already been pinned")

    is_user_owner = is_owner(selected_channel, user)
    if is_user_owner is False:
        raise InputError(description="User is not an owner of the channel")

    # Pins message and saves changes
    selected_message["is_pinned"] = True

    save_data(data)
    return {}

def message_unpin(token, message_id):
    """
    Removes a pinned message
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)

    # Gets message details, returns None if id is invalid
    selected_message = get_message(data, message_id)
    selected_channel = determine_channel(data, message_id)
    if selected_message is None:
        raise InputError(description="Message ID Invalid")

    # Checks if user is a member in the channel
    user = get_user_from_token(data, token)

    if is_user_member(user, selected_channel) is False:
        raise AccessError(description=f"User is not a member of channel")

    # Checks if message is already unpinned
    if selected_message["is_pinned"] is False:
        raise InputError(description="Message is not pinned")

    # Determines whether user is an owner of the channel
    is_user_owner = is_owner(selected_channel, user)
    if is_user_owner is False:
        raise InputError(description="User is not an owner of the channel")

    # Unpins message and saves changes
    selected_message["is_pinned"] = False

    save_data(data)

    return {}

def message_remove(token, message_id):
    """
    Removes a message from the list of messages
    Returns:
        {}  dict
    """
    data = get_data()
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
    if selected_message["u_id"] != user["u_id"]:
        if is_user_owner is False:
            if is_user_admin is False:
                raise AccessError(description="User is not an owner or admin")

    # Removes message and saves changes
    selected_channel["messages"].remove(selected_message)

    save_data(data)

    return {}

def message_edit(token, message_id, msg):
    """
    Edits an existing message. Deletes it if the new message is empty
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)

    if len(msg) > 1000:
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
    if selected_message["u_id"] != user["u_id"]:
        if is_user_owner is False:
            if is_user_admin is False:
                raise AccessError(description="User is not an owner or admin")

    # Deletes message if new message is an empty string.
    # Otherwise changes the message to the new message
    if msg == "":
        selected_channel["messages"].remove(selected_message)

    selected_message["message"] = msg

    save_data(data)
    return {}

def search(token, query_str):
    """
    Given a query string, return a collection of messages in all of the channels
    that the user has joined that match the query. Results are sorted from most
    recent message to least recent message
    ERRORS
    - Invalid token
    Returns: {
        List of dictionaries, where each dictionary contains
        types { message_id, u_id, message, time_created, reacts, is_pinned  }
        messages    list(dict)
    }
    """
    data = get_data()
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
    # Contains all info on message (message_id, u_id, message, time_created, reacts, pin)
    return {
        'messages': sorted_messages
    }
