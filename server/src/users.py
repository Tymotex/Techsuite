"""
The file contains all the user functions
"""
from database import db
from exceptions import InputError, AccessError
from util import email_is_legit, verify_token, get_user_from_token
from models import User, Channel, Bio, MemberOf

# ===== User Functions =====
def users_profile(token, user_id):
    """
        For a valid user, returns some fields about them, eg.
        id, email, first name, last name, profile image
        Returns: {
            user_id, email, name_first, name_last, profile_img_url
        }
    """
    verify_token(token)
    # Checks if user_id is valid
    user_id_is_valid = False
    
    # This if statement can be removed
    # Compares user_id with database and pulls data from inputted user_id
    for user in data["users"]:
        if user_id == user["user_id"]:
            email = user["email"]
            name_first = user["name_first"]
            name_last = user["name_last"]
            img_endpoint = user["profile_img_url"]
            # user_id is valid
            user_id_is_valid = True
    # Check if user_id is valid in the database, outside the loop
    if user_id_is_valid is False:
        raise InputError(description="User with user_id is not a valid user")
    # Returns a dictionary
    return {
        'user_id': user_id,
        # String form: 'user_id': '{:d}'.format(user_id).zfill(4),
        'email': email,
        'name_first': name_first,
        'name_last': name_last,
        'profile_img_url': img_endpoint
    }

def users_profile_uploadphoto(token, img_endpoint):
    """
    The server does the following:
    Given a URL of an image on the internet, crops the image within bounds
    (x_start, y_start) and (x_end, y_end). Position (0,0) is the top left.
    This function handles associating the saved cropped image with the user
    Returns:
        {}  dict
    """
    # Need to add the file path to the user dictionary
    data = get_data()
    verify_token(token)

    this_user = get_user_from_token(data, token)

    users = data["users"]
    for each_user in users:
        if each_user["user_id"] == this_user["user_id"]:
            each_user["profile_img_url"] = img_endpoint

    save_data(data)
    return {}

def users_get_profile_image_url(token):
    """
    The server does the following:
    Given a URL of an image on the internet, crops the image within bounds
    (x_start, y_start) and (x_end, y_end). Position (0,0) is the top left.
    This function handles associating the saved cropped image with the user
    Returns:
        'http://localhost:.../images/imagefilename.jpg'
    """
    verify_token(token)
    data = get_data()
    return {
        "profile_img_url": get_user_from_token(data, token)["profile_img_url"]
    }

def users_profile_setname(token, name_first, name_last):
    """
    Update the authorised user's first and last name
    ERRORS
    - Invalid token
    - Invalid user_id
    - name_first and name_last both must be 1-50 characters inclusive
    Returns:
        {}  dict
    """
    # Gets data from data storage
    data = get_data()
    verify_token(token)
    
    # Check if names are valid, within acceptable length
    error_description = "must be between 1 and 50 characters inclusive in length"
    if 1 <= len(name_first) <= 50:
        pass
    else:
        raise InputError(description="name_first " + error_description)
    # if name_first == [] or len(name_first) > 50:
    #     raise InputError(description="name_first " + error_description)

    if 1 <= len(name_last) <= 50:
        pass
    else:
        raise InputError(description="name_last " + error_description)
    # if name_last == [] or len(name_last) > 50:
    #     raise InputError(description="name_last " + error_description)

    # Retrieves user's data from the token
    user = get_user_from_token(data, token)
    # Updates the names in the profile of the user
    user["name_first"] = name_first
    user["name_last"] = name_last
    # Propagate changes through all channels
    for each_channel in data["channels"]:
        for each_member in each_channel["all_members"]:
            if user["user_id"] == each_member["user_id"]:
                each_member["name_first"] = name_first
                each_member["name_last"] = name_last
        for each_member in each_channel["owner_members"]:
            if user["user_id"] == each_member["user_id"]:
                each_member["name_first"] = name_first
                each_member["name_last"] = name_last
    # Saves data into data storage
    save_data(data)
    return {}

def users_profile_setemail(token, email):
    """
    Update the authorised user's email address
    ERRORS
    - Invalid token
    - Invalid email format
    - Email is already being used
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)
    
    # Check if email is valid
    if email_is_legit(email) is False:
        raise InputError(description="Email entered is not a valid email")
    # Check if email is being used by another user
    for user in data["users"]:
        if email == user["email"]:
            raise InputError(description="Email address is already being used by another user")
    # Retrieves user's data from the token
    user = get_user_from_token(data, token)
    # Updates the email in the profile of the user
    user["email"] = email
    # Saves data into data storage
    save_data(data)
    return {}

def users_all(token):
    """
    Returns a list of all users and their associated details
    ERRORS:
    - Invalid token
    Returns: {
        List of dictionaries, where each dictionary contains types user_id, email, name_first,
        name_last, profile_img_url
        users  list(dict)
    }
    """
    data = get_data()
    verify_token(token)
    
    # Get all users into a list, database prints other info as well
    users = []
    for user in data["users"]:
        users.append({
            'user_id': user["user_id"],
            'email': user["email"],
            'name_first': user["name_first"],
            'name_last': user["name_last"]
        })
    # Returns all users from database
    return {
        'users': users
    }


def admin_user_remove(token, user_id):
    """
    Given a User by their user ID, remove the user from the slackr.
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)

    user_found = False
    for i, user in enumerate(data["users"]):
        if user_id == user["user_id"]:
            del data["users"][i]
            user_found = True
    if not user_found:
        raise InputError(description="user_id does not refer to a valid user")

    for i, channel in enumerate(data["channels"]):
        for k, each_owner in enumerate(channel["owner_members"]):
            if each_owner["user_id"] == user_id:
                print(data["channels"][i]["owner_members"][k])
                del data["channels"][i]["owner_members"][k]
        for k, each_member in enumerate(channel["all_members"]):
            if each_member["user_id"] == user_id:
                print(data["channels"][i]["all_members"][k])
                del data["channels"][i]["all_members"][k]

    save_data(data)
    return {}

def admin_userpermission_change(token, user_id, permission_id):
    """
    Given a User by their user ID, set their permissions
    to new permissions described by permission_id
    ERRORS:
    - user_id does not refer to a valid user
    - permission_id does not refer to a value permission
    - The authorised user is not an owner
    Returns:
        {}  dict
    """
    data = get_data()
    verify_token(token)
    
    # Checks if user_id is valid
    user_id_is_valid = False
    # Retrieves user's data from the token
    user = get_user_from_token(data, token)
    if user["permission_id"] != 1:
        raise AccessError(description="The authorised user is not an owner")
    # have a function to check if their permission_ids is valid
    if permission_id in (1, 2):
        pass
    else:
        raise InputError(description="permission_id does not refer to a value permission")
    # Compares user_id with database and pulls data from inputted user_id
    for user in data["users"]:
        if user_id == user["user_id"]:
            # Updates permission id
            user["permission_id"] = permission_id
            user_id_is_valid = True
    # Check if user_id is valid in the database, outside the loop
    if user_id_is_valid is False:
        raise InputError(description="user_id does not refer to a valid user")
    if permission_id == 1:
        for channels in data["channels"]:
            for each_member in channels["all_members"]:
                if user_id == each_member["user_id"]:
                    user_to_add = get_user_from_id(data["users"], user_id)[2]
                    channels["owner_members"].append(user_to_add)
    # Saves data into data storage
    save_data(data)
    return {}
