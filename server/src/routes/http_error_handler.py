from json import dumps
from util.util import printColour

def error_handler(err):
    """
        Default error handler
    """
    response = err.get_response()
    try:
        printColour(" ➤ Error: {} {}".format(err, err.get_message()), colour="red")
        response.data = dumps({
            "code": err.code,
            "name": "System Error",
            "message": err.get_message(),
        })
        response.content_type = 'application/json'
        return response
    except:
        printColour(" ➤ Error: {}".format(err), colour="red")
        response.data = dumps({
            "code": err.code,
            "name": "System Error"
        })
        response.content_type = 'application/json'
        return response
