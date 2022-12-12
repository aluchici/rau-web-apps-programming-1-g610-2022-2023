from repository import create_user, get_user_by_email
from users import User


def signup(request_body, connection_string):
    # create an User object
    user = User.from_dict(request_body)

    # Validate user email & password
    user.email = user.validate_email()
    user.password = user.validate_password()

    # Check if user password == second_password
    if user.password != user.second_password:
        raise ValueError("Password mismatch. Try again using the same password.")

    create_user(user, connection_string)


def signin(request_body, connection_string):
    # create an User object
    user = User.from_dict(request_body)
    user.email = user.validate_email()
    user.password = user.validate_password()

    # extragem user existent din baza de date
    existing_user = get_user_by_email(user, connection_string)

    # comparam daca parola din request_body == parola din baza de date pt user
    if user.password != existing_user.password:
        raise ValueError("Unable to login. Password mismatch.")

    return existing_user
