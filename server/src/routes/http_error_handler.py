from json import dumps

def error_handler(err):
    """
        Default error handler
    """
    response = err.get_response()
    print('Error response: ', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_message(),
    })
    response.content_type = 'application/json'
    return response
