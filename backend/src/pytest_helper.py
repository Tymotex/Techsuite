"""
Contains helper functions used for pytests
"""
from re import search
from random import randint
from channels import channels_create
from auth import auth_register
from database import get_data

# ===== Helper Functions =====

def generate_user(email):
    """
        Generates a dummy user. Note that this assumes that only the email needs to
        be different between any two users
    """
    return auth_register(email, "123456789", "Andrew", "Taylor")

# This is a resource provided by the course (see specs)
# https://www.geeksforgeeks.org/check-if-email-address-valid-or-not-in-python/
# Python program to validate an Email
def email_is_legit(email):
    """ Given a string, determines if it matches the standard email regex """
    # Make a regular expression for validating an Email
    regex = r'^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    # pass the regualar expression and the string in search() method
    return bool(search(regex, email))

def generate_channels(creator, amount, is_public):
    """
        Generates any amount of channels under one authorised user
        Channels are named: Channel_1, Channel_2, ...
        Returns a list of all these channels' IDs
    """
    all_channel_ids = []
    for i in range(1, amount + 1):
        new_channel_name = "Channel_{}".format(i)
        # Calls channels_create and also saves the returned ID to a list
        all_channel_ids.append(
            int(channels_create(creator["token"], new_channel_name, is_public)["channel_id"])
        )
    return all_channel_ids

def get_message(message_id):
    """
    gets message details according to message_id
    """
    data = get_data()
    channels_list = data["channels"]
    for channel in channels_list:
        for message in channel["messages"]:
            if message["message_id"] == message_id:
                selected_message = message
    return selected_message

def generate_text(strings, line_amount):
    """
    Given a list of strings, return a list of messages
    """
    messages_list = []
    for _ in range(0, line_amount):
        # Choose a random index to select the string randomly
        random_index = randint(0, len(strings) - 1)
        messages_list.append(strings[random_index])
    return messages_list

def count_occurrences(strings, target):
    """
    Given an list of strings, return how many times a target string appears in the whole list
    """
    occurrences = 0
    for each_string in strings:
        # Checks if the target string is a substring (ignoring case sensitivity)
        if target.lower() in each_string.lower():
            occurrences += 1
    return occurrences
