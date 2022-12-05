import sqlite3


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
    conn.close()


def get_user_email_and_password(user, connection_string):
    conn = sqlite3.connect(connection_string)
    query = f"SELECT email, password FROM users WHERE email = '{user.email}';"
    cursor = conn.cursor()
    results = cursor.execute(query)
    return list(results)
