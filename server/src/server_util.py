import os
from PIL import Image
import requests
from exceptions import InputError
from dotenv import load_dotenv

# Globals and config:
load_dotenv()
PROFILE_IMG_DIRECTORY = os.getcwd() + r"/static/images/"

def download_img_and_crop(url, u_id, x_start, y_start, x_end, y_end):
    """
        Given a URL to an web image resource, download it to the
        project directory's 'static/images' folder with a unique filename.
        The image is then cropped and overwritten by the cropped result.

        Parameters:
        url         str
        u_id        int
        x_start     int
        y_start     int
        x_end       int
        y_end       int

        Returns the filename of the cropped image on success, otherwise
        returns None
    """
    filename = "user{}_profile.jpg".format(u_id)
    image_path = PROFILE_IMG_DIRECTORY + filename

    # Remove the previous profile picture, if it exists
    try:
        os.remove(image_path)
    except FileNotFoundError:
        pass

    # Fetching and saving the profile picture to server directory
    res = requests.get(url)
    if res.status_code != 200:
        raise InputError(description="Request to image resource failed")
    with open(image_path, "wb") as output_img:
        output_img.write(res.content)

    try:
        pic = Image.open(image_path)
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
    cropped_pic.save(image_path)
    return filename
