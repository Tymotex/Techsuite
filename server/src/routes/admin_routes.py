from flask import Blueprint, request, jsonify
import users
from util import util

admin_router = Blueprint("admin", __name__)

@APP.route("/admin/users/remove", methods=["POST"])
def handle_admin_user_remove():
    """
        HTTP Route: /admin/users/remove
        HTTP Method: DELETE
        Params: (token, u_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    u_id = int(request_data["u_id"])
    results = users.admin_user_remove(token, u_id)
    return dumps(results)

@APP.route("/admin/userspermission/change", methods=['POST'])
def handle_admins_userpermission_change():
    """
        HTTP Route: /admin/userspermission/change
        HTTP Method: POST
        Params: (token, u_id, permission_id)
        Returns JSON: {  }
    """
    request_data = request.get_json()
    token = request_data["token"]
    u_id = int(request_data["u_id"])
    permission_id = int(request_data["permission_id"])
    results = users.admin_userpermission_change(token, u_id, permission_id)
    return dumps(results)

# ===== Workspace Handling =====
@APP.route("/workspace/reset", methods=['POST'])
# TODO: Unprotected! Only let the admin use this route
def handle_workspace_reset():
    """
        HTTP Route: /workspace/reset
        HTTP Method: POST
        Params: ()
        Returns JSON: {  }
    """
    util.workspace_reset()
    return dumps({})

# TODO: Unprotected! Only let the admin use this route
@APP.route("/workspace/show", methods=["GET"])
def handle_workspace_show():
    """
        HTTP Route: /workspace/show
        HTTP Method: GET
        Params: ()
        Returns JSON holding the entire workspace state
    """
    data_store = get_data()
    show_data(data_store)
    return dumps(data_store)
