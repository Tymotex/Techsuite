import pickle
import os
import pprint
import hashlib
import jwt
from dotenv import load_dotenv

# Globals and config:
load_dotenv()
SECRET_MESSAGE = os.getenv("SECRET_MESSAGE")
SECRET_CODE = hashlib.sha256(SECRET_MESSAGE.encode()).hexdigest()

def get_user_from_token(data_store, token):
    """
        Given a token, checks if it exists. If it does, return the user data structure
        associated with the token: {
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
        