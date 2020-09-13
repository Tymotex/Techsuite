# Libraries
import sys, os, hashlib, jwt
from datetime import datetime, timezone
from dotenv import load_dotenv

# Source files:
from extensions import db
from models import User, Bio, Channel, Message, MemberOf
from exceptions import InputError, AccessError
from util.util import email_is_legit, send_email, email_message, printColour
from util.token import generate_token, verify_token
import users

# Globals and config:
load_dotenv()
SECRET_CODE = hashlib.sha256(os.getenv("SECRET_MESSAGE").encode()).hexdigest()

# ===== Authentication Functions =====
def auth_signup(email, password, username):
    """
        Creates a new account, given a user's email and password. Returns a dict containing
        a token and user_id for authenticating their session.
        Raises:
        - InputError: Invalid email format
        - InputError: Email already exists in db
        - InputError: Password less than 6 chars
        Returns: {
            user_id    (int)
            token      (str)
        }
    """
    # Check for improper inputs and raise InputError:
    if not email_is_legit(email):
        raise InputError(description="Invalid email")
    if len(password) < 6:
        raise InputError(description="Password can't be less than 6 characters")
    
    users = User.query.all()    
    # Check if the email exists in the database
    for each_user in users:
        if each_user.email == email:
            raise InputError(description="This email has already been registered with")
    # Adding a default profile picture for the user
    profile_image_endpoint = os.getenv("BASE_URI") + "/images/{}".format("default.jpg")
    # Adding a new user
    new_user_bio = Bio(
        profile_img_url=profile_image_endpoint
    )
    new_user = User(
        email=email,
        password=hashlib.sha256(password.encode()).hexdigest(),
        permission_id=1,
        username=username,
        bio=new_user_bio
    )
    db.session.add(new_user)
    db.session.add(new_user_bio)
    db.session.commit()
    generated_token = generate_token(new_user)
    printColour("Returning: {}".format({
        "user_id": new_user.id,
        "token": generated_token,
    }), colour="blue")
    return {
        "user_id": new_user.id,
        "token": generated_token,
        "username": new_user.username,
        "profile_img_url": new_user_bio.profile_img_url
    }

def auth_login(email, password):
    """
        Given a registered users' email and password logs the user in by generating
        a valid token for the session
        Raises:
        - InputError: Email doesn't belong to any user in the database
        - InputError: Password is incorrect
        Returns: {
            user_id    (int)
            token      (str)
        }
    """
    users = User.query.all()
    # Find the user object associated with the email
    for each_user in users:
        if each_user.email == email:
            if each_user.password == hashlib.sha256(password.encode()).hexdigest():
                # User has been verified once this block is reached
                generated_token = generate_token(each_user)
                printColour("Returning: {}".format({
                    "user_id": each_user.id,
                    "token": generated_token
                }), colour="blue")
                return {
                    "user_id": each_user.id,
                    "token": generated_token,
                    "username": each_user.username,
                    "profile_img_url": each_user.bio.profile_img_url
                }
            # Password is incorrect
            raise InputError(description="Password is incorrect")
    # If program execution reaches here, email does not exist
    raise InputError(description="Email doesn't exist")

def auth_logout(token):
    """
        Given a valid token, verifies it and logs out the associated user.
        Parameters:
            token  (str)
        Returns: {
            is_success(True/False)  bool
        }
    """
    # TODO: How does logging out in the backend work? It's stateless with JSON web tokens...
    if verify_token(token):
        return {
            'is_success': True
        }
    else:
        raise AccessError(description="Logout failed. Token is invalid")

# ===== Password Reset Functions ======
# TODO:
def auth_password_reset_request(email):
    """
        Given an email address, if the user is a registered user,
        sends them an email containing a specific secret code, that when entered
        in auth_passwordreset_reset, shows that the user trying to reset the password
        is the one who got sent this email.
        Raises:
        - InputError: Invalid email
        - InputError: If the email doesn't belong to an existing user
        Returns:
            {}  (dict)
    """
    return {}

# TODO:
def auth_password_reset(reset_code, new_password):
    """
    Given a reset code for a user, set that user's new password to the password provided
    ERRORS:
    - reset_code is not a valid reset code
    - Password entered is not a valid password
    - reset code can only be used once
    Returns:
        {}  (dict)
    """
    return {}
