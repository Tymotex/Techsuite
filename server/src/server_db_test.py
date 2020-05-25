import os
from flask import Flask

from routes.db_route_test import db_router
from database_config import app

app.register_blueprint(db_router)

@app.route("/")
def hello():
    return "Hello. This works"

# if __name__ == '__main__':
#     app.run(port=6969, debug=True)
    