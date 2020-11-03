from flask import Blueprint, send_file
from util.util import printColour

image_router = Blueprint("image", __name__)

LOCAL_IMG_DIR = "static/images"

# Serving images from the 'static/images' directory
@image_router.route("/images/<filename>")
def serve_image(filename):
    """ 
        Given an image filename, serves that image back with Flask's send_file
    """
    printColour(" ➤ images/{} - sending image: {}/{}".format(filename, LOCAL_IMG_DIR, filename), colour="yellow")
    return send_file("{}/{}".format(LOCAL_IMG_DIR, filename))
