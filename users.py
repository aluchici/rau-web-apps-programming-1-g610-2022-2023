import json


class User:
    special_characters = ["*", "?", "!", "#", "&", "=", "(", ")", "_", "-"]

    def __init__(self, name=None, email=None, password=None, second_password=None):
        self.name = name
        self.email = email
        self.password = password
        self.second_password = second_password
        # self.special_characters = ["*", "?", "!", "#", "&", "=", "(", ")", "_", "-"]

    def validate_email(self):
        email = self.email.lower()
        email = email.replace(" ", "")

        email_parts = email.split("@")

        if len(email_parts) > 2:
            raise ValueError("Email is not formatted correctly. Please try again.")

        second_part = email_parts[1]

        email_ending = second_part.split(".")

        if len(email_ending) > 2:
            raise ValueError("Email is not formatted correctly. Please try again.")

        return email

    def validate_password(self):
        # eliminate spaces
        present_spaces = self.password.find(" ")
        if present_spaces > -1:
            raise ValueError("Invalid password. Password contains spaces.")

        # validate length
        if len(self.password) < 8:
            raise ValueError("Invalid password. Password too short. Minimum 8 characters required.")

        # validate special characters
        present_special = 0
        present_digits = 0
        present_upper = 0
        for character in self.password:
            if character in self.special_characters:
                present_special += 1  # present_special_characters = present_special_characters + 1

            if character.isdigit():
                present_digits += 1

            if character.isupper():
                present_upper += 1

            if present_special and present_digits and present_upper:
                break

        if present_special == 0:
            raise ValueError("Invalid password. Special characters are missing.")

        if present_digits == 0:
            raise ValueError("Invalid password. Missing at least one digit.")

        if present_upper == 0:
            raise ValueError("Invalid password. Missing at least one upper case letter.")

        return self.password

    @classmethod
    def from_dict(cls, user_dict):
        obj = cls(user_dict["name"], user_dict["email"], user_dict["password"], user_dict["second_password"])
        return obj

    @classmethod
    def from_list(cls, user):
        obj = cls(user[0], user[1], user[2], user[4])
        return obj

    def to_dict(self):
        user_dict = {
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "second_password": self.second_password
        }
        return user_dict

    def to_json(self):
        user_dict = self.to_dict()
        user_json = json.dumps(user_dict)
        return user_json

