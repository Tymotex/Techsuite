from database import get_data, save_data, get_user_from_token, generate_channel_id
from exceptions import InputError, AccessError
from util import is_user_member, select_channel, get_user_from_id, verify_token

def channels_invite(token, channel_id, u_id):
    """
        Invites a user (with user id u_id) to join a channel with ID channel_id.
        Once invited the user is added to the channel immediately

        Returns: {}
    """
    # check parameters are all valid and raise exception if they aren't
    # add u_id, associated first name and last name into channel_id dictionary (or storage)
    data = get_data()
    verify_token(token)
    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")
    users_list = data["users"]
    # if channel_id is invalid, raise input error
    selected_channel = select_channel(data, channel_id)
    if selected_channel is None:
        error = "channel_id does not refer to a valid channel that the authorised user is part of."
        raise InputError(description=error)

    # check the authorised user is not already a member of the channel
    if is_user_member(auth_user, selected_channel) is False:
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    users_list = data["users"]

    is_valid_user, is_user_admin, user_to_add = get_user_from_id(users_list, u_id)

    if is_valid_user is False:
        raise InputError(description="u_id does not refer to a valid user")

    # check if user_to_add is already a member
    if is_user_member(user_to_add, selected_channel) is True:
        raise InputError(description="u_id is already a member")

    selected_channel["all_members"].append(user_to_add)

    if is_user_admin is True:
        selected_channel["owner_members"].append(user_to_add)

    save_data(data)
    return {
    }

def channels_details(token, channel_id):
    """
        Given a Channel with ID channel_id that the authorised user is
        part of, provide basic details about the channel

        returns dictionary with items 'name', 'owner_members', 'all_members'

        return {
            'name': channel_name,
            'owner_members': channel_owners,
            'all_members': channel_members,
        }
    """
    # check parameters are all valid and raise exception if they aren't

    # access data store, and retrieve information from keys:
    data = get_data()
    verify_token(token)
    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")
    # name, owner_members and all_members
    selected_channel = select_channel(data, channel_id)

    if selected_channel is None:
        raise InputError(description=f"{channel_id} is not a valid channel")

    # raise exception whe authorised user is not a member of channel with channel_id
    if is_user_member(auth_user, selected_channel) is False:
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    channel_name = selected_channel["name"]
    channel_owners = []
    for owner in selected_channel["owner_members"]:
        channel_owners.append({
            'u_id': owner["u_id"],
            'name_first': owner["name_first"],
            'name_last': owner["name_last"],
            'profile_img_url': owner["profile_img_url"]
        })

    channel_members = []
    for member in selected_channel["all_members"]:
        channel_members.append({
            'u_id': member["u_id"],
            'name_first': member["name_first"],
            'name_last': member["name_last"],
            'profile_img_url': member["profile_img_url"]
        })

    return {
        'name': channel_name,
        'owner_members': channel_owners,
        'all_members': channel_members,
    }


def channels_messages(token, channel_id, start):
    """
        Given a Channel with ID channel_id that the authorised user is part of,
        return up to 50 messages between index "start" and "start + 50" exclusive.
        Message with index 0 is the most recent message in the channel.
        This function returns a new index "end" which is the value of "start + 50", or,
        if this function has returned the least recent messages in the channel,
        returns -1 in "end" to indicate there are no more messages to load after this return.

        returns {
            messages,
            start,
            end
        }
        messages is a list of message dictionary (max size 50)
        start is an int
        end is an int
    """
    # check parameters are all valid and raise exception if they aren't

    # add u_id, associated first name and last name into channel_id dictionary (or storage)

    data = get_data()
    verify_token(token)
    
    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")
    return_messages = {
        'messages': [],
        'start': start,
    }
    # messages should be stored in a list
    # get channel with channel_id
    curr_channel = select_channel(data, channel_id)

    if curr_channel is None:
        raise InputError(description="Channel ID is not a valid channel")

    if is_user_member(auth_user, curr_channel) is False:
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    # loop through 50 message dictionaries of list starting from start index
    messsages_list = curr_channel["messages"]

    if messsages_list == []:
        return_messages["end"] = -1
        return return_messages

    # raise error if start is greater than or equal to the total number of messages in the channel
    if start >= len(messsages_list):
        error = "start is greater than or equal to the total number of messages in the channel"
        raise InputError(description=error)

    from_start = 0
    for message in messsages_list[start:]:
        return_messages["messages"].append(message)
        from_start += 1
        if from_start == 50:
            return_messages["end"] = start + 50
            return return_messages

    # and add message dictionaries into return list for messages
    # if end of list is reached, return 'end':-1 (reach this point)
    if start + 49 > len(messsages_list):
        return_messages["end"] = -1
    return return_messages

def channels_leave(token, channel_id):
    """
    Given a channel ID, the user removed as a member of this channel

    parameters:  (token, channel_id)
    types:
    token        str
    channel_id   int

    return {}
    """
    # check parameters are all valid and raise exception if they aren't

    # access all_members and owner_members lists witihn dictionary with associated channel_id

    data = get_data()
    verify_token(token)
    #identify user from token
    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")
    channels_list = data["channels"]
    curr_channel = select_channel(data, channel_id)

    # Check if Channel ID is not a valid channel
    if curr_channel is None:
        raise InputError(description="Channel ID is not a valid channel")

    # check Authorised user is not a member of channel with channel_id
    if is_user_member(auth_user, curr_channel) is False:
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    # check if user is owner of channel, remove self from owner
    owners_list = curr_channel["owner_members"]
    for owner in owners_list:
        if owner["u_id"] == auth_user["u_id"]:
            owners_list.remove(owner)
    members_list = curr_channel["all_members"]
    for member in members_list:
        if member["u_id"] == auth_user["u_id"]:
            members_list.remove(member)

    # If there is no members left in channel, delete channel
    if members_list == []:
        channels_list.remove(curr_channel)

    save_data(data)
    # remove user with associated token from both lists if possible
    return {
    }

def channels_join(token, channel_id):
    """
    Given a channel_id of a channel that the authorised user can join, adds them to that channel

    parameters:  (token, channel_id)
    types:
    token        str
    channel_id   int

    return {}
    """
    # check parameters are all valid and raise exception if they aren't

    data = get_data()
    verify_token(token)
    #identify user from token
    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")
    user_to_add = {
        "u_id": auth_user["u_id"],
        "name_first": auth_user["name_first"],
        "name_last": auth_user["name_last"],
        "profile_img_url": auth_user["profile_img_url"]
    }
    # retrieve user profile from auth_user
    is_user_admin = (auth_user["permission_id"] == 1)
    selected_channel = select_channel(data, channel_id)

    if selected_channel is None:
        raise InputError(description="Channel ID is not a valid channel")

    # check whether channel is private or not
    # and if it is, raise accessError

    if (selected_channel["is_public"] or is_user_admin) is False:
        error = "channel_id refers to a channel that is private "
        error += "(when the authorised user is not an admin), or user does not exist"
        raise AccessError(description=error)
    # check Channel ID is not a valid channel

    selected_channel["all_members"].append(user_to_add)
    if is_user_admin is True:
        selected_channel["owner_members"].append(user_to_add)
    save_data(data)
    return {
    }

def channels_addowner(token, channel_id, u_id):
    """
    Make user with user id u_id an owner of this channel
    Returns: empty dict
    Errors: InputError on invalid channel_id
            InputError when u_id already has ownership over a
            channel before calling channel_addowner
            AccessError when the user isn't an owner of the
            slackr or an owner of this channel
    """
    data = get_data()
    verify_token(token)
    #identify user from token
    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")
    users_list = data["users"]

    selected_channel = select_channel(data, channel_id)
    if selected_channel is None:
        raise InputError(description="Channel ID is not a valid channel")

    # check whether u_id is already owner in channel
    is_auth_owner = False
    is_user_owner = False
    owners_list = selected_channel["owner_members"]
    for owner in owners_list:
        if owner["u_id"] == u_id:
            is_user_owner = True
        elif owner["u_id"] == auth_user["u_id"]:
            is_auth_owner = True

    if is_user_owner is True:
        error = "When user with user id u_id is already an owner of the channel"
        raise InputError(description=error)

    if not is_auth_owner:
        error = "authorised user is not an owner of the slackr or owner of the channel"
        raise AccessError(description=error)

    user_to_add = get_user_from_id(users_list, u_id)[2]
    selected_channel["owner_members"].append(user_to_add)
    save_data(data)
    return {
    }

def channels_removeowner(token, channel_id, u_id):
    """
    Desc:    Remove user with user id u_id an owner of this channel
    Params:  (token, channel_id, u_id)
    Returns: empty dict
    Errors: InputError on invalid channel_id
            InputError when u_id DOESN'T already have ownership over
            a channel before calling channel_removeowner
            AccessError when the user isn't an owner of the
            slackr or an owner of this channel

    TYPES:
    token             str
    channel_id        int
    u_id              int
    """
    data = get_data()
    verify_token(token)
    #identify user from token
    auth_user = get_user_from_token(data, token)
    if auth_user is None:
        raise AccessError(description="Invalid Token")
    users_list = data["users"]

    selected_channel = select_channel(data, channel_id)
    if selected_channel is None:
        raise InputError(description="Channel ID is not a valid channel")

    # check whether u_id is already owner in channel
    is_auth_owner = False
    is_user_owner = False
    for owner in selected_channel["owner_members"]:
        if owner["u_id"] == u_id:
            is_user_owner = True
        if owner["u_id"] == auth_user["u_id"]:
            is_auth_owner = True

    if is_user_owner is False:
        raise InputError(description="When user with user id u_id is not an owner of the channel")

    if not is_auth_owner:
        error = "authorised user is not an owner of the slackr or owner of the channel"
        raise AccessError(description=error)

    # Get user information from
    user_to_remove = get_user_from_id(users_list, u_id)[2]
    owner_l = [o for o in selected_channel["owner_members"] if o["u_id"] != user_to_remove["u_id"]]
    selected_channel["owner_members"] = owner_l

    save_data(data)
    return {
    }

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
    verify_token(token)
    data_store = get_data()
    verify_token(token)
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
    verify_token(token)
    data_store = get_data()
    all_channels = []
    for each_channel in data_store["channels"]:
        curr_channel_data = {}
        curr_channel_data["channel_id"] = each_channel["channel_id"]
        curr_channel_data["name"] = each_channel["name"]
        curr_channel_data["description"] = each_channel["description"]
        curr_channel_data["is_public"] = each_channel["is_public"]
        all_channels.append(curr_channel_data)
    return {
        "channels": all_channels
    }

def channels_create(token, name, description, is_public):
    """
    Creates a new channel with that name that is either a public or private channel. 
    Name can't be longer than 20 characters
    Returns: {
        channel_id   int
    }
    """
    verify_token(token)
    if len(name) > 20:
        raise InputError
    
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
        "description": description,
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
