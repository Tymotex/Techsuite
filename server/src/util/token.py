# Standard libraries
import os

# Third party libraries
from dotenv import load_dotenv
import jwt

# Source files:
from exceptions import AccessError
from models import User

# Globals and config:
load_dotenv("../")
SECRET_MESSAGE = os.getenv("SECRET_MESSAGE")

# ===== Token Functions =====
def generate_token(user_data):
    """
        Generates a unique JSON web token.
        Parameters:
            user_data: { 
                user_id: int,
                email: str,
                username: str,
                profile_img_url: str
            }
        Returns:
            web_token    str
    """
    payload = {
        "user_id": user_data.id,
        "email": user_data.email,
        "username": user_data.username,
        "profile_img_url": user_data.bio.profile_img_url
    }
    web_token = jwt.encode(payload, SECRET_MESSAGE, algorithm="HS256").decode("utf-8")
    return web_token

def verify_token(token):
    """
        Given a token, checks the database and returns true if the token exists.
        If the token doesn't exist, then return false.
        Unfortunately, we need to check ourselves whether that user_id associated with
        the token has access rights, etc.
        Parameters:
            token   str
        Returns:
            True/False
    """
    try:
        jwt.decode(token, os.getenv("SECRET_MESSAGE"), algorithms=["HS256"])
        return True
    except jwt.DecodeError:
        # Token is invalid!
        raise AccessError(description="Token is invalid! {}".format(token))

def get_user_from_token(token):
    """
        Given a token, checks if it exists. If it does, return the user data structure
        associated with the token. If not, return None
        Parameters:
            token       str
        Returns: {
            user_id             int
            username            str
            email               str
            password(hashed)    str
            permission_id       int
        }
    """
    decoded_token = jwt.decode(token, os.getenv("SECRET_MESSAGE"), algorithms=["HS256"])
    if not decoded_token:
        raise AccessError(description="Invalid token supplied")
    return User.query.filter_by(id=decoded_token["user_id"]).first()
