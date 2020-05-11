"""
    File containing all globally used helper functions
"""
import functools
import re
import random
import smtplib
import jwt
import os
from dotenv import load_dotenv

# Source files:
from exceptions import AccessError

# Globals and config:
load_dotenv()

def email_is_legit(email):
    """
        Given a string, determines if it matches the standard email regex.
    """
    regex = r'^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    return bool(re.search(regex, email))

def no_users_in_database(data_store):
    """
        Checks the given data dictionary and returns true if the user database is empty
        Returns:
            len(data_store["users"])    int
    """
    return len(data_store["users"]) == 0

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
        jwt.decode(token, os.getenv("SECRET_MESSAGE"), algorithms=["HS256"])
        return True
    except jwt.DecodeError:
        # Token is invalid!
        raise AccessError(description="Token is invalid! {}".format(token))

def is_user_member(user, selected_channel):
    """
        Returns True if user is a member of selected channel, False otherwis
        function which Authorised user is not a member of channel with channel_id

        parameters:
        user             (dictionary)
        selected_channel (dictionary)

        returns boolean
    """
    for member in selected_channel["all_members"]:
        if member["u_id"] == user["u_id"]:
            return True
    return False

def select_channel(data, channel_id):
    """
        Checks whether channel exists and returns channel details
        Parameters:
            data        dict
            channel_id  int
        Returns:
            selected_channel    dict
    """
    channels_list = data["channels"]
    for channel in channels_list:
        if channel["channel_id"] == channel_id:
            selected_channel = channel
            return selected_channel
    #returns None if invalid id is given
    return None

def get_user_from_id(users_list, u_id):
    """
        Function which returns whether u_id is in user list and
        return (is_valid_user, is_user_admin, user_to_add)
        whether u_id is in user list, whether user is global admin and the details of the user

        Parameters (users_list, u_id)
        types:
        users_list      list
        u_id            integer

        return (is_valid_user, is_user_admin, user_to_add)
        types:
        is_valid_user   boolean
        is_user_admin   boolean
        user_to_add     dictionary
    """
    is_valid_user = False
    is_user_admin = False
    user_to_add = None
    for user in users_list:
        # retrieve information about user
        if user["u_id"] == u_id:
            is_valid_user = True
            if user["permission_id"] == 1:
                is_user_admin = True
            user_to_add = {
                "u_id": u_id,
                'name_first': user["name_first"],
                'name_last': user["name_last"],
                "profile_img_url": user["profile_img_url"]
            }
            break
    return (is_valid_user, is_user_admin, user_to_add)

def send_email(send_to, gmail_user, gmail_password, msg):
    """
        Function which sends mail from gmail account
        Parameters (send_to, gmail_user, gmail_password, msg):
        types:
        send_to           string
        gmail_user        string
        gmail_password    string
        msg               string

        returns nothing
    """
    smtpserver = smtplib.SMTP("smtp.gmail.com", 587)
    smtpserver.ehlo()
    smtpserver.starttls()
    smtpserver.login(gmail_user, gmail_password)
    smtpserver.sendmail(gmail_user, send_to, msg)
    smtpserver.close()

def email_message(email, reset_code, name_first, name_last):
    """
        Message contents of email sent to reset password
        Parameters:
            email       str
            reset_code  str
            name_first   str
            name_last    str
        Returns:
            message str
    """
    header = 'To:' + email + '\n' + 'From: ' + 'pythontest9582@gmail.com' + \
    '\n' + 'Subject:Password reset for SLACKR \n'
    message = header + 'This email is only for intended user.' + '\n' + \
    'Hi ' + name_first + ' ' + name_last + ',' + '\n' + \
    'We have received a request to reset your password for your Slackr account.' + '\n' + \
    'You can reset your password by inputting the reset code in the Slackr website.' + '\n' + \
    'Your reset code is:' + '\n' + \
    reset_code + '\n' + \
    'If you did not request this or do not want to change your password, do not worry.' + '\n' + \
    'Your password is still safe and you can simply ignore or delete this email.' + '\n' + \
    'But if you still feel unsafe, please report to SLACKR admins.' + '\n' + \
    'Contact email: ' + 'pythontest9582@gmail.com' + '\n' + \
    'Best regards,' + '\n' + \
    'DevMessenger' + '\n' + \
    '================== Do not reply to this email =================='
    return message

#MESSAGE HELPER FUNCTIONS

def get_message(data, message_id):
    """
    Gets message details according to message_id
    Parameters:
        data        dict
        message_id  int
    Returns:
        selected_message    dict
    """
    channels_list = data["channels"]
    for channel in channels_list:
        for message in channel["messages"]:
            if message["message_id"] == message_id:
                selected_message = message
                return selected_message
    #returns None if invalid id is given
    return None

def determine_channel(data, message_id):
    """
    Determine which channel the message is in, returns None on error
    Parameters:
        data        dict
        message_id  int
    Returns:
        selected_channel    dict
    """
    channels_list = data["channels"]
    for channel in channels_list:
        for message in channel["messages"]:
            if message["message_id"] == message_id:
                selected_channel = channel
                return selected_channel
    #returns None if message is not in channel
    return None

def is_owner(channel, user):
    """
    Determines whether member of channel is an owner or not
    Parameters:
        channel dict
        user    dict
    Returns:
        True/False  bool
    """
    owners_list = channel["owner_members"]
    for owner in owners_list:
        if owner["u_id"] == user["u_id"]:
            return True
    return False

def is_admin(data, user):
    """
    Determines whether user is a global owner
    Parameters:
        data    dict
        user    dict
    Returns:
        True/False  bool
    """
    users_list = data["users"]
    for users in users_list:
        if users["u_id"] == user["u_id"]:
            if user["permission_id"] == 1:
                return True
    return False

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

def debugBorders(func):
    """ 
        A simple decorator that adds a start and end marker for a function call.
        Meant for debugging functions.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        args_repr = [repr(a) for a in args]   
        kwargs_repr = [f"{k}={v!r}" for k, v in kwargs.items()]    
        signature = ", ".join(args_repr + kwargs_repr)   
        print(f"=====* Start of {func.__name__}({signature}) *=====")
        func(*args, **kwargs)
        print(f"=====*  End of {func.__name__}  *=====")
    # The function is now wrapped by two additional print statements
    return wrapper
