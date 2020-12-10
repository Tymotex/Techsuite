"""
The file contains all the user functions
"""
from database import db
from exceptions import InputError, AccessError
from util.util import email_is_legit, printColour, username_valid, get_user_from_id
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
            {  
                first_name, last_name, cover_img_url, 
                title, summary, location, education, 
                email, username 
            }
    """
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise InputError(description="{} does not refer to any user in the database".format(user_id))
    return {
        "first_name": user.bio.first_name,
        "last_name" : user.bio.last_name,
        "cover_img_url" : user.bio.cover_img_url,
        "title" : user.bio.title,
        "summary" : user.bio.summary,
        "location" : user.bio.location,
        "education" : user.bio.education,
        "email": user.email,
        "username": user.username
    }

def users_bio_update(token, user_id, updated_bio):
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise InputError(description="Target user doesn't exist")
    user.bio.first_name = updated_bio["first_name"]
    user.bio.last_name=updated_bio["last_name"]
    user.bio.cover_img_url=updated_bio["cover_img_url"]
    user.bio.summary=updated_bio["summary"]
    user.bio.location=updated_bio["location"]
    user.bio.title=updated_bio["title"]
    user.bio.education=updated_bio["education"]
    db.session.commit()
    return { "succeeded": True }

def users_profile_set_username(token, username):
    """
        Update the authorised user's first and last name
        Parameters:
            token (str)
            username (str)
    """
    verify_token(token)
    user = get_user_from_token(token)
    if not user:
        raise InputError(description="Target user doesn't exist")
    if not username_valid(username):
        raise InputError(
            description="Username, {}, must only use alphanumeric characters and be 1-20 characters long".format(username)
        )
    user.username = username
    db.session.commit()

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
    user = get_user_from_token(token)
    if not user:
        raise InputError(description="Target user doesn't exist")
    # If the email is unchanged, do nothing
    if user.email == email:
        return
    # The supplied email must pass the email regex format 
    if not email_is_legit(email):
        raise InputError(description="Email entered is not a valid email")
    # Email mustn't be in use by any existing user
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise InputError(description="{} is being used by another user".format(email))
    user.email = email
    db.session.commit()

def users_profile_update(token, email, username):
    users_profile_set_username(token, username)
    users_profile_setemail(token, email)

def user_channels_list(token, user_id):
    """
        Provide a list of all channels (and their associated details)
        Parameters:
            token   (str)
            user_id (int)
        Returns: 
            { channels }
        Where:
            List of dictionaries: { channel_id, name, channel_img_url, description, visibility, member_of, owner_of }
    """
    verify_token(token)
    user = get_user_from_id(user_id)
    channels_list = []
    all_channels = Channel.query.all()
    for each_channel in all_channels:
        curr_channel_data = {
            "channel_id": each_channel.id,
            "name": each_channel.name,
            "channel_img_url": each_channel.channel_img_url,
            "channel_cover_img_url": each_channel.channel_cover_img_url,
            "description": each_channel.description,
            "visibility": each_channel.visibility,
            "member_of": False,
            "owner_of": False
        }
        memberships = each_channel.channel_membership
        for membership in memberships:
            if membership.user_id == user.id:
                curr_channel_data["member_of"] = True
                if membership.is_owner:
                    curr_channel_data["owner_of"] = True 
        channels_list.append(curr_channel_data)
    return {
        "channels": channels_list
    }
