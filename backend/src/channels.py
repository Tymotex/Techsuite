"""
Functions for channels
"""
from database import get_data, save_data, generate_channel_id, get_user_from_token, verify_token
import error

def channels_list(token):
    """
    Provide a list of all channels (and their associated details) that the
    authorised user is part of
    Parameters:
        token   str
    Returns: {
        List of dictionaries, where each dictionary contains types { channel_id, name }
        channels    list(dict())
    }
    """
    if not verify_token(token):
        raise error.AccessError
    data_store = get_data()
    associated_channels = []
    member = get_user_from_token(data_store, token)
    member = {
        "name_first": member["name_first"],
        "name_last": member["name_last"],
        "u_id": member["u_id"],
        "profile_img_url": member["profile_img_url"]
    }
    for each_channel in data_store["channels"]:
        if member in each_channel["all_members"]:
            curr_channel_data = {}
            curr_channel_data["channel_id"] = each_channel["channel_id"]
            curr_channel_data["name"] = each_channel["name"]
            associated_channels.append(curr_channel_data)
    return {
        'channels': associated_channels
    }

def channels_listall(token):
    """
    Provide a list of all channels (and their associated details)
    Parameters:
        token   str
    Returns: {
        List of dictionaries, where each dictionary contains types { channel_id, name }
        channels    list(dict())
    }
    """
    if not verify_token(token):
        raise error.AccessError
    data_store = get_data()
    all_channels = []
    for each_channel in data_store["channels"]:
        curr_channel_data = {}
        curr_channel_data["channel_id"] = each_channel["channel_id"]
        curr_channel_data["name"] = each_channel["name"]
        all_channels.append(curr_channel_data)
    return {
        "channels": all_channels
    }

def channels_create(token, name, is_public):
    """
    Creates a new channel with that name that is either a public or private channel
    ERRORS:
    - Name longer than 20 characters
    Parameters:
        token   str
        name    str
        is_public   bool
    Returns:
        channel_id   int
    """
    if len(name) > 20:
        raise error.InputError
    if not verify_token(token):
        raise error.AccessError
    data_store = get_data()
    new_channel_id = generate_channel_id(data_store)
    creator = get_user_from_token(data_store, token)
    creator = {
        "name_first": creator["name_first"],
        "name_last": creator["name_last"],
        "u_id": creator["u_id"],
        "profile_img_url": creator["profile_img_url"]
    }
    new_channel_data = {
        "channel_id": new_channel_id,
        "is_public": is_public,
        "name": name,
        "owner_members": [creator],
        "all_members": [creator],
        "messages": [],
        "stand_up_active": False,
        "stand_up": {
            "time_finish": None,
            "messages": []
        }
    }
    data_store["channels"].append(new_channel_data)
    save_data(data_store)
    return {
        'channel_id': new_channel_id
    }
