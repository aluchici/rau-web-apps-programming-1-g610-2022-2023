# In terminal, run pip install flask if flask is not already installed
import json

from flask import Flask, request

from besmart.api.account import get_user_details, delete_user_details
from besmart.api.register import signup, signin
from besmart.api.repository import CONNECTION_STRING

app = Flask("besmart-api")


@app.route("/", methods=["GET"])
def home():
    return "<h1>Welcome to our IOT App</h1>"


@app.route("/api/v1/version", methods=["GET"])
def version():
    api_version = {
        "name": "besmart-app",
        "version": "v0.0.1",
        "last_updated": "2022-12-12"
    }
    response = json.dumps(api_version)
    return response, 200


@app.route("/api/v1/register", methods=["POST"])
def register():
    try:
        request_body = request.json
        signup(request_body, CONNECTION_STRING)
        return "", 204
    except Exception as e:
        error_message = {
            "error": f"Something went wrong. Cause: {e}"
        }
        error_json = json.dumps(error_message)
        return error_json, 500


@app.route("/api/v1/authenticate", methods=["POST"])
def authenticate():
    try:
        request_body = request.json
        user = signin(request_body, CONNECTION_STRING)
        response = {
            "id": user.id,
            "name": user.name
        }
        response_json = json.dumps(response)
        return response_json, 200
    except Exception as e:
        error_message = {
            "error": f"Something went wrong. Cause: {e}"
        }
        error_json = json.dumps(error_message)
        return error_json, 500


@app.route("/api/v1/account/<user_id>", methods=["GET", "PUT", "DELETE"])
def account(user_id):
    # if request.method == "GET", get all users
    if request.method == "GET":
        try:
            user = get_user_details(user_id, CONNECTION_STRING)
            return user.to_json(), 200
        except Exception as e:
            error_message = {
                "error": f"Something went wrong. Cause: {e}"
            }
            error_json = json.dumps(error_message)
            return error_json, 500

    # if request.method == "PUT", edit user details
    if request.method == "PUT":
        pass

    # if request.method == "DELETE", delete user from DB
    if request.method == "DELETE":
        try:
            delete_user_details(user_id, CONNECTION_STRING)
            return "", 200
        except Exception as e:
            error_message = {
                "error": f"Something went wrong. Cause: {e}"
            }
            error_json = json.dumps(error_message)
            return error_json, 500


app.run(port=5610, debug=True)