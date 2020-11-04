# Source files:
from extensions import db
from models import Channel, User, Message, MemberOf, Bio
from exceptions import InputError, AccessError
from util.util import is_user_member, get_message, select_channel, printColour, user_is_admin, user_is_owner
from util.token import verify_token, get_user_from_token

def message_send(token, channel_id, message):
    """
        Sends a message to the selected channel.
        Parameters:
            token      (str)
            channel_id (int)
            message    (str)
        Returns: 
            { message_id }
    """
    verify_token(token)
    if not message:
        raise InputError("Message can't be empty")
    if len(message) > 1000:
        raise InputError("Message is over 1000 characters")
    user = get_user_from_token(token)
    selected_channel = select_channel(channel_id)
    # Raise error if the user is not a part of the channel they are trying to message in
    if not is_user_member(user, selected_channel):
        raise AccessError(description="User is not a member of channel with channel_id")

    sent_message = Message(
        channel=selected_channel,
        user=user,
        message=message
    )
    db.session.add(sent_message)
    db.session.commit()
    return {
        "message_id": sent_message.id
    }

def message_remove(token, message_id):
    """
        Removes a message from the list of messages
        Returns: { old_message }  
    """
    verify_token(token)
    message_obj = Message.query.filter_by(id=message_id).first()
    if not message_obj:
        raise InputError("Message doesn't exist")
    calling_user = get_user_from_token(token)
    if calling_user.id != message_obj.user_id:
        raise AccessError("You can't modify someone else's message")

    # Removes message and saves changes
    db.session.delete(message_obj)
    db.session.commit()
    return {
        "old_message": message_obj.message
    }

def message_edit(token, message_id, message):
    """
        Edits an existing message. Deletes it if the new message is empty
    """
    verify_token(token)
    if len(message) > 1000:
        raise InputError("Message is over 1000 characters")
    if not message:
        raise InputError("New message can't be empty")
    user = get_user_from_token(token)
    message_obj = Message.query.filter_by(id=message_id).first()
    is_user_owner = user_is_owner(token, message_obj.channel_id)
    is_user_admin = user_is_admin(token)
    if message_obj.user_id == user.id or is_user_admin or is_user_owner:
        printColour("Editing message from '{}' to '{}'".format(message_obj.message, message), colour="red_1")
        message_obj = Message.query.filter_by(id=message_id).first()
        message_obj.message = message
        db.session.commit()
    else:
        printColour("Not permitted to edit message", colour="red_1")
        raise AccessError("You are not authorised to edit this message")    
    return {}

def messages_search_match(token, channel_id, query_str):
    """
        Given a query string, return a collection of messages from the target channel
        that matches the query string. Results are sorted from most
        recent message to least recent message
        ERRORS
        - Invalid token
        Returns: {
            messages: [ { message_id, user_id, message, time_created }, { ... }, ... ]
        }
    """
    verify_token(token)
    # Empty result
    if query_str == "":
        return {}
    
    user = get_user_from_token(token)
    # Searches all messages and compares query_str
    search_results = []

    channel = Channel.query.filter_by(id=channel_id).first()
    all_messages = channel.messages_sent

    for message_obj in all_messages:
        curr_message = message_obj.message
        print(curr_message)
        print(message_obj.time_created)
        # Case-insensitive matching
        if curr_message.lower().find(query_str.lower()) != -1:
            print("{} matches {}!".format(curr_message, query_str))
            search_results.append({
                "message_id": message_obj.id,
                "user_id": message_obj.user_id,
                "message": message_obj.message,
                "time_created": message_obj.time_created.timestamp()
            })
    
    sorted_messages = sorted(search_results, key=lambda k: k['time_created'])
    
    # Returns messages that contain query_str
    # Contains all info on message (message_id, user_id, message, time_created)
    return {
        'messages': sorted_messages
    }
