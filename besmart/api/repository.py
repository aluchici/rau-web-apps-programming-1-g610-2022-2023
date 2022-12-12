import sqlite3

from users import User


CONNECTION_STRING = "/Users/luchicla/Work/RAU/rau-web-apps-programming-1-g610-2022-2023/besmart/datastore/besmart.db"


def create_user(user, database_connection_string):
    # conecteaza-te la baza de date
    conn = sqlite3.connect(database_connection_string)

    # creeaza un query valid
    # name = "User 3"
    # email = "f@d.c"
    # password = "sdlas£31d--!AA"
    # second_password = "sdlas£31d--!AA"

    query = f"""insert into users (name, email, password, second_password)
    values ('{user.name}', '{user.email}', '{user.password}', '{user.second_password}');"""

    # creeaza un cursor
    cursor = conn.cursor()

    # foloseste cursorul pentru a executa query-ul
    cursor.execute(query)

    # salveaza modificarile daca este cazul
    conn.commit()

    # inchide conexiunea la baza de date (daca este cazul)
    cursor.close()
    conn.close()


def get_user_by_email(user, connection_string):
    query = f"SELECT id, name, email, password FROM users WHERE email = '{user.email}';"

    conn = sqlite3.connect(connection_string)

    cursor = conn.cursor()

    try:
        results = cursor.execute(query).fetchone()
        cursor.close()
        conn.close()
    except Exception as e:
        cursor.close()
        conn.close()
        raise e

    user = User.from_list(results)

    return user
