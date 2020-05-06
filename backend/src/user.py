"""
The file contains all the user functions
"""
from database import get_data, get_user_from_token, save_data, verify_token
from error import InputError, AccessError
from helper import email_is_legit

# ===== User Functions =====
def user_profile(token, u_id):
    """
    For a valid user, returns information about their user
    id, email, first name, last name, and handle
    ERRORS
    - Invalid token
    - Invalid u_id
    Parameters:
        token   str
        u_id    int
    Returns: {
        user    dict
    }
    """
    # Gets data from data storage
    data = get_data()
    # Checks if u_id is valid
    u_id_is_valid = False
    # Access error if token is invalid
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")
    # This if statement can be removed
    # Compares u_id with database and pulls data from inputted u_id
    for user in data["users"]:
        if u_id == user["u_id"]:
            email = user["email"]
            name_first = user["name_first"]
            name_last = user["name_last"]
            handle_str = user["handle_str"]
            img_endpoint = user["profile_img_url"]
            # u_id is valid
            u_id_is_valid = True
    # Check if u_id is valid in the database, outside the loop
    if u_id_is_valid is False:
        raise InputError(description="User with u_id is not a valid user")
    # Returns a dictionary
    return {
        'user': {
            'u_id': u_id,
            # String form: 'u_id': '{:d}'.format(u_id).zfill(4),
            'email': email,
            'name_first': name_first,
            'name_last': name_last,
            'handle_str': handle_str,
            'profile_img_url': img_endpoint
        }
    }

def user_profile_uploadphoto(token, img_endpoint):
    """
    The server does the following:
    Given a URL of an image on the internet, crops the image within bounds
    (x_start, y_start) and (x_end, y_end). Position (0,0) is the top left.
    This function handles associating the saved cropped image with the user
    Parameters:
        token           str
        img_endpoint    int
    Returns:
        {}  dict
    """
    # Need to add the file path to the user dictionary
    data = get_data()

    this_user = get_user_from_token(data, token)

    users = data["users"]
    for each_user in users:
        if each_user["u_id"] == this_user["u_id"]:
            each_user["profile_img_url"] = img_endpoint

    save_data(data)
    return {}

def user_profile_setname(token, name_first, name_last):
    """
    Update the authorised user's first and last name
    ERRORS
    - Invalid token
    - Invalid u_id
    - name_first and name_last both must be 1-50 characters inclusive
    Parameters:
        token       str
        name_first  str
        name_last   str
    Returns:
        {}  dict
    """
    # Gets data from data storage
    data = get_data()
    # Access error if token is invalid
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")
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
            if user["u_id"] == each_member["u_id"]:
                each_member["name_first"] = name_first
                each_member["name_last"] = name_last
        for each_member in each_channel["owner_members"]:
            if user["u_id"] == each_member["u_id"]:
                each_member["name_first"] = name_first
                each_member["name_last"] = name_last
    # Saves data into data storage
    save_data(data)
    return {}

def user_profile_setemail(token, email):
    """
    Update the authorised user's email address
    ERRORS
    - Invalid token
    - Invalid email format
    - Email is already being used
    Parameters:
        token   str
        email   str
    Returns:
        {}  dict
    """
    # Gets data from data storage
    data = get_data()
    # Access error if token is invalid
    verify_token(token)
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")
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

def user_profile_sethandle(token, handle_str):
    """
    Update the authorised user's handle (i.e. display name)
    ERRORS
    - Invalid token
    - Handle must be 2-20 characters inclusive
    - Handle is already used
    Parameters:
        token       str
        handle_str  str
    Returns:
        {}  dict
    """
    # Gets data from data storage
    data = get_data()
    # Access error if token is invalid
    if verify_token(token) is False:
        raise AccessError(description="token passed in is not a valid token")
    # Check if handle is within length
    if (len(handle_str) < 2) or (len(handle_str) > 20):
        raise InputError(description="handle_str must be between 2 and 20 characters inclusive")
    # Handle is already used by another user
    for user in data["users"]:
        if handle_str == user["handle_str"]:
            raise InputError(description="handle is already used by another user")
    # Retrieves user's data from the token
    user = get_user_from_token(data, token)
    # Updates the handle_str in the profile of the user
    user["handle_str"] = handle_str
    # Saves data into data storage
    save_data(data)
    return {}
