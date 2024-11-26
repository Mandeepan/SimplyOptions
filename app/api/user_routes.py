from flask import Blueprint, make_response, jsonify, request
from flask_login import login_required

from app.models import User, db

user_routes = Blueprint("users", __name__)


@user_routes.route("/")
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route("/<int:userId>")
@login_required
def get_user(userId):
    try:
        user = User.query.get(userId)
        if user:
            return make_response(jsonify(user.to_dict()), 200)
        else:
            return {"message": "User couldn't be found"}, 404
    except Exception as e :
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})

@user_routes.route("/<int:userId>", methods=['PATCH'])
# @login_required
def update_user(userId):
    try:
        data = request.get_json()
        user = User.query.filter_by(id=userId).first()
        if not user:
            return make_response(jsonify({"message": "User couldn't be found"}), 404)
        # if some of the items are not provided in the request body, default as the original
        user.first_name = data.get("first_name",user.first_name)
        user.last_name = data.get("last_name",user.last_name)
        user.user_cash_balance = data.get("user_cash_balance",user.user_cash_balance)
        user.amount_to_be_credited = data.get("amount_to_be_credited",user.amount_to_be_credited)
        user.amount_to_be_debited = data.get("amount_to_be_debited",user.amount_to_be_debited)
        user.user_available_balance = data.get("user_available_balance",user.user_available_balance)
        user.company_id = data.get("company_id",user.company_id)
        user.is_issuer = data.get("is_issuer",user.is_issuer)

        db.session.commit()

        response_body = {
            "id": userId,
            "first_name": user.first_name,
            "last_name" :user.last_name,
            "email":user.email,
            # "hashed_password":user.hashed_password,
            "user_cash_balance" :user.user_cash_balance,
            "amount_to_be_credited":user.amount_to_be_credited,
            "amount_to_be_debited":user.amount_to_be_debited,
            "user_available_balance": user.user_available_balance,
            "company_id":user.company_id,
            "is_issuer":user.is_issuer,
        }
        return make_response(jsonify(response_body), 201)
    except Exception as e :
        # if there's error, rollback the database change
        db.session.rollback()
        return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})

