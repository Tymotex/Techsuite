"""
===== DATABASE FUNCTIONS =====
Summary:
get_data()        Reads the data.bin file and gives back a dictionary holding
                  all values for the current programs state
                  If data.bin doesn't exist, this creates one and gives back a
                  clean data structure
save_data(dict)   Writes a dictionary to data.bin
show_data(dict)   Prints the data structure with proper formatting
wipe_data()       Removes the data.bin file
"""
import pickle
import os
import pprint
import hashlib
import jwt

def get_data():
    """
    Returns a dictionary used to keep program state, eg.
    channels, users, messages, tokens, etc.
    Gets the last state if the data.bin file was previously saved to
    Parameters:
        None
    Returns:
        data_storage    dict
    """
    data_storage = {
        "counters": {
            "u_id_count": 0,
            "m_id_count": 0,
            "channel_id_count": 0,
            "react_id_count": 0
        },
        "valid_tokens": {},
        "users": [],
        "channels": []
    }
    try:
        data_file = open("data.bin", "rb")
        last_state = pickle.load(data_file)
        return last_state
    except FileNotFoundError:
        # Return blank template data structure
        save_data(data_storage)
        return data_storage

def save_data(data_store):
    """
    Writes the given dictionary into a file called data.bin to save program state.
    This MUST be called for data changes to persist!
    Parameters:
        data_store  dict
    Returns:
        None
    """
    with open("data.bin", "wb") as data_file:
        pickle.dump(data_store, data_file)

def show_data(data_store):
    """
    DEBUGGING FUNCTION. Use this to see the current state of the data
    Parameters:
        data_store  dict
    Returns:
        None
    """
    pprint.pprint(data_store, width=100)

def wipe_data():
    """
    Removes data.bin, if it exists
    Parameters:
        None
    Returns:
        None
    """
    try:
        os.remove("data.bin")
    except FileNotFoundError:
        pass

# ===== Generating IDs =====
# README:
# To generate an ID, you must pass in the data structure you obtained from get_data()

def generate_m_id(data_store):
    """
    Get the current counter value for message ID. Increment, then return that ID
    Parameters:
        data_store  dict
    Returns:
        data_store["counters"]["m_id_count"]    int
    """
    data_store["counters"]["m_id_count"] += 1
    return data_store["counters"]["m_id_count"]

def generate_u_id(data_store):
    """
    Get the current counter value for user ID. Increment, then return that ID
    Parameters:
        data_store  dict
    Returns:
        data_store["counters"]["u_id_count"]    int
    """
    data_store["counters"]["u_id_count"] += 1
    return data_store["counters"]["u_id_count"]

def generate_channel_id(data_store):
    """
    Get the current counter value for channel ID. Increment, then return that ID
    Parameters:
        data_store  dict
    Returns:
        data_store["counters"]["channel_id_count"]  int
    """
    data_store["counters"]["channel_id_count"] += 1
    return data_store["counters"]["channel_id_count"]

# ===== Utility Functions =====
SECRET_MESSAGE = "davidzhang420"
SECRET_CODE = hashlib.sha256(SECRET_MESSAGE.encode()).hexdigest()

# Generating a unique token
def generate_token(data_store, user_data):
    """
    Generates a token. Needs access to data_store
    Parameters:
        data_store    dict
        user_data     dict
    Returns:
        web_token    str
    """
    web_token = jwt.encode(user_data, SECRET_MESSAGE, algorithm="HS256").decode("utf-8")
    data_store["valid_tokens"][user_data["u_id"]] = web_token
    return web_token

def verify_token(token):
    """
    Given a token, checks the database and returns true if the token exists.
    If the token doesn't exist, then return false.
    Unfortunately, we need to check ourselves whether that u_id associated with
    the token has access rights, etc.
    Parameters:
        token   str
    Returns:
        True/False  bool
    """
    try:
        jwt.decode(token, SECRET_MESSAGE, algorithms=["HS256"])
        return True
    except jwt.DecodeError:
        # Token is invalid!
        return False

def get_user_from_token(data_store, token):
    """
    Given a token, checks if it exists.
    If it does, return the user data structure associated with the token: {
        u_id,
        name_first,
        name_last,
        email,
        password, (hashed)
        permission_id
    }.
    If not, return None
    Parameters:
        data_store  dict
        token       str
    Returns: {
        u_id                int
        name_first          str
        name_last           str
        email               str
        password(hashed)    str
        permission_id       int
    }
    """
    for each_token in data_store["valid_tokens"].items():
        if token == each_token[1]:
            matched_u_id = each_token[0]
            for each_user in data_store["users"]:
                if each_user["u_id"] == matched_u_id:
                    return each_user
    return None

def generate_reset_code(dict_email):
    """
    Generates a unique reset_code
    Parameters:
        dict_email  dict
    Returns:
        reset_code  str
    """
    reset_code = jwt.encode(dict_email, SECRET_CODE, algorithm="HS256").decode("utf-8")
    return reset_code

def verify_reset_code(reset_code):
    """
    Given a reset_code, check if it is valid
    Parameters:
        reset_code  str
    Returns:
        True/False  bool
    """
    try:
        jwt.decode(reset_code, SECRET_CODE, algorithms=["HS256"])
        return True
    except jwt.DecodeError:
        # reset_code is invalid!
        return False
        