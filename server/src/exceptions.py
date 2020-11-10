from werkzeug.exceptions import HTTPException

class AccessError(HTTPException):
    code = 400
    
    def __init__(self, description="No message specified"):
        HTTPException.__init__(self)
        self.message = description
    
    def get_message(self):
        return self.message
        
    def __repr__(self):
        return self.get_message()

class InputError(HTTPException):
    code = 400

    def __init__(self, description="No message specified"):
        HTTPException.__init__(self)
        self.message = description

    def get_message(self):
        return self.message

    def __repr__(self):
        return self.get_message()
