from flask import Blueprint, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/")
def authenticate():
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {"errors": {"message": "Unauthorized"}}, 401


@auth_routes.route("/login", methods=["POST"])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data["email"]).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route("/logout")
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {"message": "User logged out"}


@auth_routes.route("/signup", methods=["POST"])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    # form['csrf_token'].data = request.cookies['csrf_token']
    csrf_token = request.cookies.get("csrf_token", None)
    form["csrf_token"].data = csrf_token

    if not form.validate_on_submit():
        # Print form errors to understand why it failed validation
        print("Form validation failed. Errors:", form.errors)
        return form.errors, 401

    if form.validate_on_submit():
        user = User(
            first_name=form.data["first_name"],
            last_name=form.data["last_name"],
            email=form.data["email"].lower(),
            is_issuer=form.data["is_issuer"],
        )
        user.password = form.data["password"]
        try:
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return user.to_dict()
        except Exception as e:
            db.session.rollback()
            return {
                "errors": {"database": "An error occurred while saving the user"}
            }, 500

    return form.errors, 401


@auth_routes.route("/unauthorized")
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {"errors": {"message": "Unauthorized"}}, 401
