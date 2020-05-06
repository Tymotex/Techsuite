"""
Contains functions for auth
"""
import hashlib
from datetime import datetime, timezone
import sys
import jwt
from database import get_data, save_data, generate_u_id, generate_token
from database import verify_token, generate_reset_code, verify_reset_code
import error
from helper import no_users_in_database, generate_handlestr, email_is_legit
from helper import send_email, email_message
import user

SECRET_MESSAGE = "davidzhang420"
SECRET_CODE = hashlib.sha256(SECRET_MESSAGE.encode()).hexdigest()

# ===== Authorisation Functions =====
def auth_login(email, password):
    """
    Given a registered users' email and password and generates
    a valid token for the user to remain authenticated
    ERRORS:
    - Invalid email format
    - Email doesn't belong to any user
    - Password not correct
    Parameters:
        email       str
        password    str
    Returns: {
        u_id    int
        token   str
    }
    """
    if not email_is_legit(email):
        raise error.InputError(description="Not a legit email")
    data_store = get_data()

    # Find the user object associated with the email
    for each_user in data_store["users"]:
        if each_user["email"] == email:
            if each_user["password"] == hashlib.sha256(password.encode()).hexdigest():
                print("Password is correct")
                # User has been verified once this block is reached
                generated_token = generate_token(data_store, each_user)
                save_data(data_store)
                return {
                    "u_id": each_user["u_id"],
                    "token": generated_token
                }
            # Password is incorrect
            raise error.InputError(description="Password is incorrect")
    # If program execution reaches here, email does not exist
    save_data(data_store)
    raise error.InputError(description="Email doesn't exist")

def auth_logout(token):
    """
    Given an active token, invalidates the taken to log the user out.
    If a valid token is given, and the user is successfully logged out,
    it returns true, otherwise false.
    Parameters:
        str1 (str): token
    Returns: {
        is_success(True/False)  bool
    }
    """
    if verify_token(token):
        data_store = get_data()
        for each_token in data_store["valid_tokens"].items():
            if each_token[1] == token:
                del data_store["valid_tokens"][each_token[0]]
                print("Deleted token! Logged out now")
                save_data(data_store)
                return {
                    'is_success': True
                }
        raise error.AccessError(description="Logout failed. Token doesn't exist")
    else:
        raise error.AccessError(description="Logout failed. Token is invalid")

def auth_register(email, password, name_first, name_last, is_bot=True):
    """
    Given a user's first and last name, email address, and password,
    create a new account for them and return a new token for authentication
    in their session. A handle is generated that is the concatentation
    of a lowercase-only first name and last name. If the concatenation
    is longer than 20 characters, it is cutoff at 20 characters.
    If the handle is already taken, you may modify the handle in any
    way you see fit to make it unique.
    ERRORS:
    - Invalid email format
    - Email already exists in db
    - Password less than 6 chars
    - firstname and lastname both must be 1-50 characters inclusive
    Parameters:
        email       str
        password    str
        name_first  str
        name_last   str
    Returns: {
        u_id    int
        token   str
    }
    """
    if not email_is_legit(email):
        raise error.InputError(description="Fake email")
    if len(password) < 6:
        raise error.InputError(description="Password can't be less than 6 characters")
    if len(name_first) > 50 or not name_first or len(name_last) > 50 or not name_last:
        raise error.InputError("First and last names must be between 1 to 50 characters each")
    data_store = get_data()
    # Check if the email exists in the database
    for each_user in data_store["users"]:
        if each_user["email"] == email:
            raise error.InputError(description="Email already exists")

    # Adding a default profile picture for the user
    # Checking that a server port was supplied (to remain compatible with integration tests)
    # The following code only runs when the server is active
    image_endpoint = None
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
            image_endpoint = "http://localhost:{0}/images/{1}".format(port, "default.jpg")
        except ValueError:
            pass
    # Generate a new user dictionary containing all fields
    new_user_data = {
        "u_id": generate_u_id(data_store),
        "email": email,
        "password": hashlib.sha256(password.encode()).hexdigest(),
        "name_first": name_first,
        "name_last": name_last,
        "handle_str": generate_handlestr(data_store, name_first, name_last),
        "permission_id": 1 if no_users_in_database(data_store) else 2,
        "profile_img_url": image_endpoint,
        "is_bot": is_bot
    }
    data_store["users"].append(new_user_data)
    generated_token = generate_token(data_store, new_user_data)
    save_data(data_store)

    # Checking that a server port was supplied (to remain compatible with integration tests)
    # The following code only runs when the server is active
    if len(sys.argv) > 1:
        if len(data_store["users"]) == 1:
            bot_register()

    return {
        'u_id': new_user_data["u_id"],
        'token': generated_token,
    }

def bot_register():
    """
    The email and passwords for the bot registration don't matter. They are just placeholders
    Parameters:
        None
    Returns:
        None
    """
    bot_data = auth_register("hangmanbot@slackr.com", "hangman", "Hangman", "Bot", True)
    bot_id = bot_data["u_id"]
    bot_token = bot_data["token"]
    print(f"Bot's ID is :{bot_id}")
    # Adding a profile pic to the bot
    try:
        port = int(sys.argv[1])
        image_endpoint = "http://localhost:{0}/images/{1}".format(port, "defaultbot.jpg")
    except ValueError:
        image_endpoint = None
    user.user_profile_uploadphoto(bot_token, image_endpoint)

def auth_passwordreset_request(email):
    """
    Given an email address, if the user is a registered user,
    send's them a an email containing a specific secret code, that when entered
    in auth_passwordreset_reset, shows that the user trying to reset the password
    is the one who got sent this email.
    ERRORS:
    - Invalid email
    - Check if email exists
    Parameters:
        email   str
    Returns:
        {}  dict
    """
    send_request = False
    if not email_is_legit(email):
        raise error.InputError(description="Invalid email")
    data_store = get_data()
    # Check if the email exists in the database
    for each_user in data_store["users"]:
        if each_user["email"] == email:
            name_first = each_user["name_first"]
            name_last = each_user["name_last"]
            send_request = True
    if not send_request:
        raise error.InputError(description="Email does not exist in database")
    # Start a timer
    time_now = datetime.now()
    time_sent = time_now.replace(tzinfo=timezone.utc).timestamp()
    # Generate a reset code
    dict_email = {
        'email': email,
        'time': time_sent
    }
    reset_code = generate_reset_code(dict_email)
    # Send email
    msg = email_message(email, reset_code, name_first, name_last)
    send_email(email, "pythontest9582@gmail.com", "Ppython2183", msg)
    # Add reset code to database
    if data_store.get("reset_code") is None:
        data_store["reset_code"] = [reset_code]
    else:
        data_store["reset_code"].append(reset_code)
    save_data(data_store)
    return {}

def auth_passwordreset_reset(reset_code, new_password):
    """
    Given a reset code for a user, set that user's new password to the password provided
    ERRORS:
    - reset_code is not a valid reset code
    - Password entered is not a valid password
    - reset code can only be used once
    Parameters:
        reset_code      str
        new_password    str
    Returns:
        {}  dict
    """
    data_store = get_data()
    # Check if reset code is valid
    if not verify_reset_code(reset_code):
        raise error.AccessError(description="reset code passed in is not valid")
    # Check if reset code has already been used
    for code in data_store["reset_code"]:
        if code == reset_code:
            has_reset_code_been_used = True
    if not has_reset_code_been_used:
        raise error.InputError(description="Reset code has already been used")
    # Reset code expires after 5 minutes
    time_now_dt = datetime.now()
    time_used = time_now_dt.replace(tzinfo=timezone.utc).timestamp()
    time_sent = jwt.decode(reset_code, SECRET_CODE, algorithms=["HS256"])['time']
    time_difference = time_used - time_sent
    if time_difference > 300:
        data_store["reset_code"].remove(reset_code)
        raise error.AccessError(description="Reset code has expired")   
    # New password must meet requirements
    if len(new_password) < 6:
        raise error.InputError(description="Password can't be less than 6 characters")
    # Gets email
    email = jwt.decode(reset_code, SECRET_CODE, algorithms=["HS256"])['email']
    # Compares email with database to change password
    for each_user in data_store["users"]:
        if each_user["email"] == email:
            # Replaces old password with new password
            each_user["password"] = hashlib.sha256(new_password.encode()).hexdigest()
    # Delete reset code after it is confirmed valid (or after password is resetted)
    data_store["reset_code"].remove(reset_code)
    save_data(data_store)
    return {}
