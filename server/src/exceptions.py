from werkzeug.exceptions import HTTPException

class InvalidInputException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

class AccessError(HTTPException):
    code = 400
    
    def __init__(self, description="No message specified"):
        HTTPException.__init__(self)
        self.message = description
    
    def get_message(self):
        return self.message

class InputError(HTTPException):
    code = 400

    def __init__(self, description="No message specified"):
        HTTPException.__init__(self)
        self.message = description

    def get_message(self):
        return self.message

