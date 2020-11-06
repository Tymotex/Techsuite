"""
The file contains all the user functions
"""
from database import db
from exceptions import InputError, AccessError
from util.util import email_is_legit, printColour
from util.token import verify_token, get_user_from_token
from models import User, Channel, Bio, MemberOf, Connection


# ===== User Functions =====
def users_profile(token, user_id):
    """
        For a valid user, returns some of their basic fields
        Parameters:
            token (str)
            user_id (int)
        Returns: 
        { user_id, email, username, profile_img_url, is_connected_to, connection_is_pending }
    """
    verify_token(token)
    calling_user = get_user_from_token(token)
    target_user = User.query.filter_by(id=user_id).first()
    if not target_user:
        raise InputError(description="user_id does not refer to any user in the database")
    
    connected = False
    pending = False
    connection = Connection.query.filter_by(user_id=calling_user.id, other_user_id=target_user.id).first()
    if connection:
        if connection.approved:
            connected = True
        else:
            pending = True
    return {
        "user_id": target_user.id,
        "email": target_user.email,
        "username": target_user.username,
        "profile_img_url": target_user.bio.profile_img_url,
        "is_connected_to": connected,
        "connection_is_pending": pending
    }

def users_profile_upload_photo(token, user_id, img_endpoint):
    """
        Given a URL to an image, updates the user's bio tuple to hold
        the new profile picture's URL.  
    """
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    user.bio.profile_img_url = img_endpoint
    db.session.commit()

def users_profile_upload_cover(token, user_id, img_endpoint):
    """
        Given a URL to an image, updates the user's bio tuple to hold
        the new cover image's URL.  
    """
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    # printColour("Setting user {}'s image endpoint to {}".format(user_id, img_endpoint))
    user.bio.cover_img_url = img_endpoint
    db.session.commit()

def users_all(token):
    """
        Returns a list of all users and their associated details
        Parameters:
            token (str)
        Returns: 
            { users }
        Where:
            users: list of dictionaries: { user_id, email, username, profile_img_url }
    """
    verify_token(token)
    
    # Get all users into a list, database prints other info as well
    all_users = User.query.all()
    users = [{ "user_id": user.id, "email": user.email, "username": user.username, "profile_img_url": user.bio.profile_img_url } for user in all_users]
    return { "users": users }

def users_bio_fetch(token, user_id):
    """
        Returns the target user's bio and its associated details
        Parameters:
            token   (str)
            user_id (int)
        Returns: 
            {  first_name, last_name, cover_img_url, title, summary, location, education }
    """
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise InputError(description="user_id does not refer to any user in the database")
    return {
        "first_name": user.bio.first_name,
        "last_name" : user.bio.last_name,
        "cover_img_url" : user.bio.cover_img_url,
        "title" : user.bio.title,
        "summary" : user.bio.summary,
        "location" : user.bio.location,
        "education" : user.bio.education
    }

def users_bio_update(token, user_id, updated_bio):
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise InputError(description="user_id does not refer to any user in the database")
    user.bio.first_name = updated_bio["first_name"]
    user.bio.last_name=updated_bio["last_name"]
    user.bio.cover_img_url=updated_bio["cover_img_url"]
    user.bio.summary=updated_bio["summary"]
    user.bio.location=updated_bio["location"]
    user.bio.title=updated_bio["title"]
    user.bio.education=updated_bio["education"]
    db.session.commit()
    return { "succeeded": True }



# def users_get_profile_image_url(token):
#     """
#         TODO: DEPRECATED?
#         Returns:
#             'http://localhost:.../images/imagefilename.jpg'
#     """
#     verify_token(token)
#     data = get_data()
#     return {
#         "profile_img_url": get_user_from_token(data, token)["profile_img_url"]
#     }

# TODO: Unimplemented
def users_profile_set_username(token, username):
    """
        Update the authorised user's first and last name
        Parameters:
            token (str)
            username (str)
        Returns:
            {}  
    """
    verify_token(token)
    
    # TODO: validate the username   

    # Retrieves user's data from the token
    user = get_user_from_token(token)
    
    return {}

# TODO: Unimplemented
def users_profile_setemail(token, email):
    """
        Update the authorised user's email address
        Parameters:
            token (str)
            email (str)
        Returns:
            {} 
    """
    verify_token(token)
    
    # Validate the supplied email
    if not email_is_legit(email):
        raise InputError(description="Email entered is not a valid email")
    
    # TODO Check if email is being used by another user
    
    user = get_user_from_token(token)
    
    # TODO: Update record
    return {}

# TODO: Unimplemented
def admin_user_remove(token, user_id):
    """
        Given a User by their user ID, remove the user as admin.
        Returns:
            {} 
    """
    verify_token(token)
    return {}

# TODO: Unimplemented
def admin_userpermission_change(token, user_id, permission_id):
    """
        Given a user ID, set their authorisation level to permission_id
        Returns:
            {}
    """
    verify_token(token)
    return {}
