# Third party libraries
from flask import Blueprint, request, jsonify

# Local imports
import users
from util import util
from db_manage import create_all, drop_all

admin_router = Blueprint("admin", __name__)

@admin_router.route("/admin/users/remove", methods=["POST"])
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
    return jsonify(results)

@admin_router.route("/admin/userspermission/change", methods=['POST'])
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
    return jsonify(results)

# ===== Workspace Handling =====

# TODO: Unprotected! Only let the admin use this route
@admin_router.route("/admin/reset", methods=['GET'])
def handle_workspace_reset():
    """
        Drops all tables
        HTTP Route: /admin/reset
        HTTP Method: GET
        Params: ()
        Returns JSON: { succeeded }
    """
    drop_all()
    create_all()
    return jsonify({
        "succeeded": True
    })

# TODO: Unprotected! Only let the admin use this route
@admin_router.route("/workspace/show", methods=["GET"])
def handle_workspace_show():
    """
        HTTP Route: /workspace/show
        HTTP Method: GET
        Params: ()
        Returns JSON holding the entire workspace state
    """
    data_store = get_data()
    show_data(data_store)
    return jsonify(data_store)
