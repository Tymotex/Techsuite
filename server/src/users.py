"""
The file contains all the user functions
"""
from database import db
from exceptions import InputError, AccessError
from util.util import email_is_legit, printColour
from util.token import verify_token, get_user_from_token
from models import User, Channel, Bio, MemberOf


# ===== User Functions =====
def users_profile(token, user_id):
    """
        For a valid user, returns some of their basic fields
        Parameters:
            token (str)
            user_id (int)
        Returns: 
        { user_id, email, username, profile_img_url }
    """
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise InputError(description="user_id does not refer to any user in the database")
    return {
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
        "profile_img_url": user.bio.profile_img_url
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
    user.bio.cover_img_url = img_endpoint
    db.session.commit()

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

# TODO: 
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

# TODO
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
    return {
        "users": users
    }

def users_bio_fetch(token, user_id):
    verify_token(token)
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise InputError(description="user_id does not refer to any user in the database")
    printColour("Fetched " + str(user_id) + "'s bio:")
    print(user.bio)
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
    return {
        "succeeded": True
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
