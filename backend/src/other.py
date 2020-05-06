"""The file contains all the other functions"""
from error import InputError, AccessError
from database import get_data, save_data, wipe_data, verify_token, get_user_from_token
from helper import is_user_member, get_user_from_id

# ===== Other Functions =====
def users_all(token):
    """
    Returns a list of all users and their associated details
    ERRORS:
    - Invalid token
    Parameters:
        token      str
    Returns: {
        List of dictionaries, where each dictionary contains types u_id, email, name_first,
        name_last, handle_str, profile_img_url
        users  list(dict)
    }
    """
    # Gets data from data storage
    data = get_data()
    # Access error if token is invalid
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")
    # Get all users into a list, database prints other info as well
    users = []
    for user in data["users"]:
        users.append({
            'u_id': user["u_id"],
            'email': user["email"],
            'name_first': user["name_first"],
            'name_last': user["name_last"],
            'handle_str': user["handle_str"]
        },)
    # Returns all users from database
    return {
        'users': users
    }

def search(token, query_str):
    """
    Given a query string, return a collection of messages in all of the channels
    that the user has joined that match the query. Results are sorted from most
    recent message to least recent message
    ERRORS
    - Invalid token
    Parameters:
        token       str
        query_str   str
    Returns: {
        List of dictionaries, where each dictionary contains
        types { message_id, u_id, message, time_created, reacts, is_pinned  }
        messages    list(dict)
    }
    """
    # Gets data from data storage
    data = get_data()
    # Access error if token is invalid
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")
    # For an empty string input, nothing happens and is returned
    if query_str == "":
        return None
    # Retrieves user's data from the token
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

def admin_user_remove(token, u_id):
    """
    Given a User by their user ID, remove the user from the slackr.
    Parameters:
        token   str
        u_id    int
    Returns:
        {}  dict
    """
    data = get_data()
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")

    user_found = False
    for i, user in enumerate(data["users"]):
        if u_id == user["u_id"]:
            del data["users"][i]
            user_found = True
    if not user_found:
        raise InputError(description="u_id does not refer to a valid user")

    for i, channel in enumerate(data["channels"]):
        for k, each_owner in enumerate(channel["owner_members"]):
            if each_owner["u_id"] == u_id:
                print(data["channels"][i]["owner_members"][k])
                del data["channels"][i]["owner_members"][k]
        for k, each_member in enumerate(channel["all_members"]):
            if each_member["u_id"] == u_id:
                print(data["channels"][i]["all_members"][k])
                del data["channels"][i]["all_members"][k]
    # show_data(data)

    save_data(data)
    return {}

def admin_userpermission_change(token, u_id, permission_id):
    """
    Given a User by their user ID, set their permissions
    to new permissions described by permission_id
    ERRORS:
    - u_id does not refer to a valid user
    - permission_id does not refer to a value permission
    - The authorised user is not an owner
    Parameters:
        token           str
        u_id            int
        permission_id   int
    Returns:
        {}  dict
    """
    # Gets data from data storage
    data = get_data()
    # Access error if token is invalid
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")
    # Checks if u_id is valid
    u_id_is_valid = False
    # Retrieves user's data from the token
    user = get_user_from_token(data, token)
    if user["permission_id"] != 1:
        raise AccessError(description="The authorised user is not an owner")
    # have a function to check if their permission_ids is valid
    if permission_id in (1, 2):
        pass
    else:
        raise InputError(description="permission_id does not refer to a value permission")
    # Compares u_id with database and pulls data from inputted u_id
    for user in data["users"]:
        if u_id == user["u_id"]:
            # Updates permission id
            user["permission_id"] = permission_id
            u_id_is_valid = True
    # Check if u_id is valid in the database, outside the loop
    if u_id_is_valid is False:
        raise InputError(description="u_id does not refer to a valid user")
    if permission_id == 1:
        for channels in data["channels"]:
            for each_member in channels["all_members"]:
                if u_id == each_member["u_id"]:
                    user_to_add = get_user_from_id(data["users"], u_id)[2]
                    channels["owner_members"].append(user_to_add)
    # Saves data into data storage
    save_data(data)
    return {}

def workspace_reset():
    """
    Resets the workspace state
    ERRORS
    - None
    Parameters:
        None
    Returns:
        {}  dict
    """
    # Wipe data
    wipe_data()
    return {}
