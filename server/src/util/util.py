"""
    File containing global helper functions
"""
# Standard libraries
import functools, re, random, os

# Third party libraries
from dotenv import load_dotenv
from colored import stylize
import jwt, requests, hashlib, colored, smtplib
from PIL import Image

# Source files:
from exceptions import AccessError, InputError
from models import User, Channel, Bio, MemberOf, Message
from database import db

# Globals and config:
load_dotenv("../")

SECRET_MESSAGE = os.getenv("SECRET_MESSAGE")
SECRET_CODE = hashlib.sha256(SECRET_MESSAGE.encode()).hexdigest()
IMAGE_DIRECTORY = os.getcwd() + r"/src/static/images/"        # TODO: Not robust? Cwd should always be project root

# ===== Debugging Utilities =====
def printColour(text, colour="green", bordersOn=True):
    """
        Given a string and a colour keyword, prints the string with the colour applied.
        See a list of all the available 256 colours: https://pypi.org/project/colored/
    """
    if bordersOn:
        print(stylize("|============================================|", colored.fg(colour)))
        print(stylize(text, colored.fg(colour)))
        print(stylize("|============================================|", colored.fg(colour)))
    else:
        print(stylize(text, colored.fg(colour)))
        
def funcDebugBorders(func):
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

# ===== Input Validators =====
def email_is_legit(email):
    """
        Given a string, determines if it matches the standard email regex.
    """
    regex = r'^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    return bool(re.search(regex, email))

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

# TODO: Implement
def user_is_admin(token):
    return True

def user_is_owner(token, channel_id):
    channel_obj = Channel.query.filter_by(id=channel_id).first()
    user_obj = get_user_from_token(token)
    for each_owner in channel_obj.channel_membership:
        if each_owner.user_id == user_obj.id:
            return True
    return False


# ===== User Utilities =====
def is_user_member(user, selected_channel):
    """
        Returns True if user is a member of the selected channel, False otherwise.
        Parameters:
            user             obj
            selected_channel obj
        Returns: True/False
    """
    for each_membership in selected_channel.channel_membership:
        if each_membership.user_id == user.id:
            return True    

def get_user_from_id(user_id):
    """
        Returns the user object associated with the given user_id
        Parameters:
            user_id            integer
        Returns: 
            user            (obj)
    """
    return User.query.filter_by(id=user_id).first()

# ===== Password Reset Utilities =====
# TODO:
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

# TODO:
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
    return "TODO"

# ===== Message Utilities =====
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

# ===== Channel Utilities =====
def determine_channel(message_id):
    """
    Determine which channel the message is in, returns None on error
    Parameters:
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

def select_channel(channel_id):
    """ 
        Returns the channel object associated with the given channel_id, 
        if it exists.
    """
    return Channel.query.filter_by(id=channel_id).first()

# ===== Image Manipulation =====
def download_img_and_get_filename(url, user_id):
    """
        Given a URL to an web image resource, download it to the
        project directory's 'static/images' folder with a unique filename
        of format: user_x_profile.jpg where x is the user's ID
        Parameters:
            url         (str)
            user_id     (int)
        Returns:
            Filename (str) of the image on success, otherwise returns None
    """
    filename = "user_{}_profile.jpg".format(user_id)
    image_path = IMAGE_DIRECTORY + filename

    # Remove the previous profile picture, if it exists
    try:
        printColour("Removing existing profile picture: {}".format(filename), colour="red_1")
        os.remove(image_path)
    except FileNotFoundError:
        pass

    # Fetching and saving the profile picture to server directory
    print(url)
    res = requests.get(url)
    if res.status_code != 200:
        raise InputError(description="Request to image resource failed")
    with open(image_path, "wb") as output_img:
        printColour("Saving picture: {}".format(image_path), colour="blue")
        output_img.write(res.content)
    return filename

def crop_image_file(image_filename, x_start, y_start, x_end, y_end):
    image_path = IMAGE_DIRECTORY + image_filename
    try:
        pic = Image.open(image_path)
        # Discard the alpha/transparency channel
        pic = pic.convert('RGB')   
    except:
        raise InputError(description="Not a valid image file!")

    crop_coordinates = (x_start, y_start, x_end, y_end)
    width, height = pic.size
    if (x_start > width or y_start > height or
            x_end > width or y_end > height or
            x_start < 0 or y_start < 0 or
            x_end < 0 or y_end < 0 or
            x_start > x_end or y_start > y_end
       ):
        raise InputError(description="Coordinates out of bounds")

    cropped_pic = pic.crop(crop_coordinates)
    cropped_pic.save(image_path, compression='jpeg')

def get_latest_filename(filename, version_num=1):
    """
        Given a filename, eg. user_1_profile.jpg, returns that filename
        with the base name appended with a unique number. 
        Eg. user_1_profile_3.jpg
    """
    image_path = IMAGE_DIRECTORY + filename
    basename = os.path.splitext(filename)[0]
    version_num = version_num
    curr_filename = "{0}_{1}.jpg".format(basename, version_num)
    print("Curr filename: " + curr_filename)
    
    file_exists = False
    for eachFile in os.listdir(IMAGE_DIRECTORY):
        print("Investigating: " + eachFile)
        if eachFile == curr_filename:
            file_exists = True
            break;
    if file_exists:
        return get_latest_filename(filename, version_num + 1)
    else:
        return curr_filename
