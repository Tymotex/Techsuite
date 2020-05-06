"""
Functions for standup
"""
import datetime
import threading
from message import message_send
from database import get_data, save_data, get_user_from_token
from error import InputError, AccessError
from helper import is_user_member

# ========== Helper function ==========
def send_standup_msg(token, channel_id):
    """
    Send all the buffered messages as one combined message and
    wipe the stand_up data so that it is inactive after this function
    Parameters:
        token       str
        channel_id  str
    Returns:
        {}  dict
    """
    data = get_data()
    channels_list = data["channels"]
    selected_channel = {}
    for channel in channels_list:
        if channel["channel_id"] == channel_id:
            selected_channel = channel
    try:
        standup = selected_channel["stand_up"]
    except KeyError:
        return
    standup_messages = standup["messages"]
    # message may become longer then 1000 characters
    message_to_send = ""
    for message in standup_messages:
        message_to_send += message + "\n"
    message_send(token, channel_id, message_to_send)

    data = get_data()
    channels_list = data["channels"]
    for channel in channels_list:
        if channel["channel_id"] == channel_id:
            selected_channel = channel
    selected_channel["stand_up_active"] = False
    save_data(data)

# ========== standup function ==========
def start(token, channel_id, length):
    """
    For a given channel, start the standup period whereby for the next "length"
    seconds if someone calls "standup_send" with a message, it is buffered during
    the X second window then at the end of the X second window a message will be
    added to the message queue in the channel from the user who started the standup.
    X is an integer that denotes the number of seconds that the standup occurs for
    Parameters:
        token       str
        channel_id  int
        length      int
    Returns: {
        time_finish int
    }
    """
    data = get_data()

    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")

    # If channel_id is invalid, raise input error
    channels_list = data["channels"]
    is_valid_channel = False
    for channel in channels_list:
        if channel["channel_id"] == channel_id:
            # Target channel was found in DB
            is_valid_channel = True
            selected_channel = channel

    if not is_valid_channel:
        raise InputError(description="""
            channel_id does not refer to a valid channel that the authorised user is part of.
        """)

    # check if standup is already in progress
    if selected_channel["stand_up_active"]:
        raise InputError(description="An active standup is currently running in this channel")

    now = int(round(datetime.datetime.now().timestamp()))
    now_plus_length = now + length

    # add standup data to selected channel
    selected_channel["stand_up"] = {
        "time_finish": now_plus_length,
        "messages": []
    }

    timer = threading.Timer(length, send_standup_msg, [token, channel_id])
    timer.start()
    selected_channel["stand_up_active"] = True
    save_data(data)
    return {
        "time_finish": now_plus_length
    }

def active(token, channel_id):
    """
    For a given channel, return whether a standup is active in it,
    and what time the standup finishes. If no standup is active, then time_finish returns None
    Parameters:
        token       str
        channel_id  int
    Returns: {
        is_active   bool
        time_finish int
    }
    """
    data = get_data()

    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")

    # if channel_id is invalid, raise input error
    channels_list = data["channels"]
    is_valid_channel = False
    for channel in channels_list:
        if channel["channel_id"] == channel_id:
            # Target channel was found in DB
            is_valid_channel = True
            selected_channel = channel

    if not is_valid_channel:
        raise InputError(description="""
            channel_id does not refer to a valid channel that the authorised user is part of.
        """)

    if selected_channel["stand_up_active"]:
        return {
            "is_active": True,
            "time_finish": selected_channel["stand_up"]["time_finish"]
        }
    return {
        "is_active": False,
        "time_finish": None
    }

def send(token, channel_id, message):
    """
    Sending a message to get buffered in the
    standup queue, assuming a standup is currently active
    Parameters:
        token       str
        channel_id  int
        message     str
    Returns:
        {}  dict
    """
    data = get_data()

    auth_user = get_user_from_token(data, token)

    if auth_user is None:
        raise AccessError(description="Invalid Token")
    if len(message) > 1000:
        raise InputError(description="Message is more than 1000 characters")

    channels_list = data["channels"]
    # if channel_id is invalid, raise input error
    is_valid_channel = False
    for channel in channels_list:
        if channel["channel_id"] == channel_id:
            # Target channel was found in DB
            is_valid_channel = True
            selected_channel = channel

    if not is_valid_channel:
        raise InputError(description="""
            channel_id does not refer to a valid channel that the authorised user is part of.
        """)

    # check if an active standup is not currently running in this channel
    active_result = active(token, channel_id)
    if not active_result["is_active"]:
        raise InputError(description="An active standup is not currently running in this channel")

    if not is_user_member(auth_user, selected_channel):
        raise AccessError(description="""
            The authorised user is not a member of the channel that the message is within
        """)

    # adds first name of person to message
    message = auth_user["name_first"] + ": " + message

    selected_channel["stand_up"]["messages"].append(message)
    print("saved: " + message)
    save_data(data)
    return {}
