"""
Creates hangman game and allows user(s) to play
"""
import json
import random
import urllib.request
from database import get_data, save_data, verify_token, get_user_from_token
from helper import select_channel, is_user_member
from error import AccessError, InputError
from nouns import NOUNS, ANIMALS
from adjectives import ADJECTIVES, POLITE_ADJECTIVES

# Helper
# Credits: https://github.com/concentricsky/python-randomnames

def get_random_adjective():
    return random.choice(ADJECTIVES).lower()

def get_random_noun():
    return random.choice(NOUNS).lower()

def get_random_animal():
    return random.choice(ANIMALS).lower()

def start_game(token, channel_id):
    """
    Starts a game of hangman
    Parameters:
        token       str
        channel_id  int
    Returns:
        blank_word str
    """
    data = get_data()

    if verify_token(token) is False:
        raise AccessError(description="Invalid Token")

    # generate random word
    random_noun = get_random_noun()
    random_animal = get_random_animal()
    random_adj_noun = get_random_adjective() + " " + get_random_noun()
    random_adj_animal = get_random_adjective() + " " + get_random_animal()
    random_word = random.choice([random_noun, random_animal, random_adj_noun, random_adj_animal])

    #fills blank_word list with _'s for start of hangman game
    blank_word = [("_" if random_word[i] != " " else " ") for i in range(len(random_word))]

    #determine user_id from token
    user = get_user_from_token(data, token)

    selected_channel = select_channel(data, channel_id)

    #raises error if user is not a part of the channel they are trying to post to
    if is_user_member(user, selected_channel) is False:
        raise AccessError(description="User is not a member of channel with channel_id")

    #adds hangman game details to channel dictionary
    selected_channel["hangman_game"] = {
        "word": random_word,
        "guesses": [],
        "word_state": blank_word,
        "hangman_index": 0,
        "hangman_ascii": ["", '''
=========''', '''
    |
    |
    |
    |
    =========''', '''
    +----------
    |
    |
    |
    |
    =========''', '''
    +----------
    |      |
    |
    |
    |
    =========''', '''
    +----------
    |      |
    |      O
    |
    |
    =========''', '''
    +----------
    |      |
    |      O
    |      |
    |
    =========''', '''
    +----------
    |      |
    |      O
    |     /|
    |
    =========''', '''
    +----------
    |      |
    |      O
    |     /|\\
    |
    =========
    ''', '''
    +----------
    |      |
    |      O
    |     /|\\
    |     /
    =========
    ''', '''
    +----------
    |      |
    |      O
    |     /|\\🖕
    |     / \\
    =========
    ''']
    }

    save_data(data)
    return "Welcome to Hangman.\nWord: " + " ".join(blank_word) + " -> " + random_word

def check_guess(token, guess, channel_id):
    """
    Checks guess of user to see whether it is in the word
    Parameters:
        token       str
        guess       str
        channel_id  int
    Returns:
        victory/loss    str     OR
        hidden_word     str
    """

    data = get_data()
    if verify_token(token) is False:
        raise AccessError(description="Invalid Token")

    #selects channel
    selected_channel = select_channel(data, channel_id)
    current_game = selected_channel["hangman_game"]
    current_word = current_game["word"]

    #if guess is more than 1 letter raises an error
    if len(guess) != 1:
        raise InputError(description="Only 1 guess allowed")

    # If the guessed character is not a letter in the alphabet, then throw
    # an InputError
    if not guess.isalpha():
        raise InputError(description="Only letters are allowed")

    #raises an error if the letter has been guessed already
    for prev_guess in current_game["guesses"]:
        if guess == prev_guess:
            raise InputError(description="Letter already guessed")

    #determine user_id from token
    user = get_user_from_token(data, token)

    #raises error if user is not a part of the channel they are trying to post to
    if is_user_member(user, selected_channel) is False:
        raise AccessError(description="User is not a member of channel with channel_id")

    #inserts guess into list of guesses so far
    current_game["guesses"].insert(0, guess)

    #determines position of guess in word if it is in the word and adds them to a list

    i = 0
    #if guess is in the word, replaces "_" with the letter in word_state and makes letter_hit True
    letter_hit = False
    for i, letter in enumerate(list(current_word)):
        if guess == letter:
            current_game["word_state"][i] = guess
            letter_hit = True

    if not letter_hit:
        current_game["hangman_index"] += 1

    #  Checks if the game is finished or not and returns an appropriate string to be displayed
    # pylint: disable=R1705
    if current_game["word_state"] == list(current_game["word"]):
        #when game is won
        del selected_channel["hangman_game"]
        save_data(data)
        return current_game["word"].upper() + "\nCongratulations! You won!"

    elif current_game["hangman_index"] == len(current_game["hangman_ascii"]) - 1:
        #when game is lost
        del selected_channel["hangman_game"]
        save_data(data)
        return current_game["word"].upper() + "\nYou lost.\n" + \
        current_game["hangman_ascii"][current_game["hangman_index"]]

    else:
        # If the game has not concluded
        save_data(data)
        curr_word_progress = " ".join(current_game["word_state"]).upper()
        curr_hangman_ascii = current_game["hangman_ascii"][current_game["hangman_index"]]
        curr_guess = "\nYou guessed: {}".format(", ".join(current_game["guesses"]).upper())
        return "\nWord: " + curr_word_progress + curr_hangman_ascii + curr_guess
