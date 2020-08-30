# Standard libraries:
import os

# Third party libraries:
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

# Local imports:
import users
from util.util import printColour, download_img_and_get_filename, crop_image_file
from util.token import get_user_from_token

# Globals and config:
load_dotenv()
users_router = Blueprint("users", __name__)
BASE_URL = "http://localhost:{0}".format(os.getenv("PORT"))

@users_router.route("/users/profile", methods=['GET'])
def handle_user_profile():
    """
        HTTP Route: /users/profile
        HTTP Method: GET
        Params: (token, user_id)
        Returns JSON: { user_id, email, username, profile_img_url }
    """
    token = request.args.get("token")
    user_id = int(request.args.get("user_id"))
    printColour("User profile: {}".format(request.args), colour="violet")
    return jsonify(users.users_profile(token, user_id))

@users_router.route("/users/profile/setemail", methods=['PUT'])
def handle_user_profile_setemail():
    """
        HTTP Route: /users/profile/setemail
        HTTP Method: PUT
        Params: (token, email)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    email = request_data["email"]
    return jsonify(users.users_profile_setemail(token, email))

# TODO: new addition
@users_router.route("/users/bio", methods=['GET'])
def handle_users_bio_fetch():
    """
        HTTP Route: /users/bio
        HTTP Method: GET
        Params: (token, user_id)
        Returns JSON: {
            first_name, last_name, cover_img_url, summary, location, title, education
        }
    """
    token = request.args.get("token")
    user_id = int(request.args.get("user_id"))
    printColour("Fetching user " + str(user_id) + "'s bio")
    return jsonify(users.users_bio_fetch(token, user_id))

# TODO: new addition
@users_router.route("/users/bio", methods=['POST'])
def handle_users_bio_update():
    """
        HTTP Route: /users/bio
        HTTP Method: POST
        Params: (token, user_id, first_name, last_name, cover_img_url, summary, location, title, education)
        Returns JSON: { succeeded }
    """
    request_data = request.get_json()
    token = request_data["token"]
    user_id = int(request_data["user_id"])
    printColour("Updating user " + str(user_id) + "'s bio")
    bio = {
        "first_name": request_data["first_name"],
        "last_name": request_data["last_name"],
        "cover_img_url": request_data["cover_img_url"],
        "summary": request_data["summary"],
        "location": request_data["location"],
        "education": request_data["education"],
        "title": request_data["title"]
    }
    return jsonify(users.users_bio_update(token, user_id, bio))

@users_router.route("/users/bio", methods=['GET'])
def handle_users_all():
    """
        HTTP Route: /users/all
        HTTP Method: GET
        Params: (token, user_id)
        Returns JSON: {
            
        }
    """
    token = request.args.get("token")
    return jsonify(users.users_bio(token))


# ===== User Profile Picture Handling =====
# @users_router.route("/users/profileimage")
# def get_profile_image_url():
#     """
#         TODO: Deprecated?
#         Returns the URL to the requesting user's profile picture
#     """
#     return jsonify(users.users_get_profile_image_url(request.args.get("token")))



from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.getcwd() + r"/src/static/images/"        # TODO: Not robust? Cwd should always be project root
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@users_router.route("/users/profile/uploadphoto", methods=['POST'])
def handle_user_profile_upload_photo():
    """
        HTTP Route: /users/profile/uploadphoto
        HTTP Method: POST
        Params: (token, x_start, y_start, x_end, y_end)
        Returns JSON: { succeeded }
    """

    token = request.form["token"]
    printColour(request.form["x_start"])
    printColour(request.form["y_start"])
    printColour(request.form["x_end"])
    printColour(request.form["y_end"])
    x_start = int(request.form["x_start"])
    y_start = int(request.form["y_start"])
    x_end = int(request.form["x_end"])
    y_end = int(request.form["y_end"])
    printColour("ATTEMPTING TO UPLOAD IMAGE FILE. Coordinates: " + str(x_start) + str(y_start) + str(x_end) + str(y_end))

    # check if the post request has the file part
    if 'file' not in request.files:
        printColour("USER DIDN'T UPLOAD ANY PHOTO")
        return jsonify({ "succeeded": False })
    else:
        printColour("Saving the user's photo")
        file = request.files['file']
        print(file)
        print("==============================")
        if file.filename == '':
            # if user does not select file, browser also submit an empty part without filename
            printColour("No selected file")
            return jsonify({ "succeeded": False })
        if file and allowed_file(file.filename):
            print(file)
            user_id = get_user_from_token(token).id
            filename = "user_{}_profile.jpg".format(user_id)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            crop_image_file(filename, x_start, y_start, x_end, y_end)
            image_endpoint = "{0}/images/{1}".format(BASE_URL, filename)
            users.users_profile_upload_photo(token, image_endpoint)
            return jsonify({ "succeeded": True })
