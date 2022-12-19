from besmart.api.repository import delete_user, get_user_by_id


def get_user_details(user_id, connection_string):
    user = get_user_by_id(user_id, connection_string)
    return user


def update_user_details():
    pass


def delete_user_details(user_id, connection_string):
    delete_user(user_id, connection_string)
