from flask import Blueprint, send_file

image_router = Blueprint("image", __name__)

# Serving images from the 'static/images' directory
@image_router.route("/images/<filename>")
def serve_image(filename):
    """ Given an image filename, serves that image back with Flask's send_file """
    return send_file("static/images/{}".format(filename))
