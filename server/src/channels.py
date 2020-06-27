from extensions import db
from models import Channel, User, Message, MemberOf, Bio
from exceptions import InputError, AccessError
from util.util import is_user_member, select_channel, get_user_from_id, printColour
from util.token import get_user_from_token, verify_token

def channels_invite(token, channel_id, user_id):
    """
        Invites a user, with the given user_id, to join the channel with ID channel_id.
        Once invited, the user is added to the channel immediately.
        Parameters:
            token       (str)
            channel_id  (channel_id)
            user_id     (int)
        Returns: 
            {}          (dict)
    """
    printColour("RECEIVED CHANNEL ID: {}".format(channel_id), colour="blue")
    printColour("RECEIVED USER ID: {}".format(user_id), colour="blue")
    verify_token(token)
    calling_user = get_user_from_token(token)
    if not calling_user:
        raise AccessError(description="Invalid Token")
    
    # If channel_id is invalid, raise input error
    selected_channel = select_channel(channel_id)
    if not selected_channel:
        raise InputError(description="channel_id doesn't reference a valid channel that the user is part of.")
    # Check the authorised user is not already a member of the channel
    if not is_user_member(calling_user, selected_channel):
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    invited_user = User.query.filter_by(id=user_id).first() 
    # Check that the user exists (ie. the user_id is valid)
    if not invited_user:
        raise InputError(description="user_id does not refer to a valid user")
    # Check if invited_user is already a member
    if is_user_member(invited_user, selected_channel):
        raise InputError(description="{} is already a member".format(invited_user.username))
    # Granting membership
    new_membership = MemberOf(
        user=invited_user,
        channel=selected_channel,
        is_owner=False
    )
    printColour("Trying to add user {} to channel {}".format(new_membership.user.id, new_membership.channel.id), colour="blue")
    
    db.session.add(new_membership)
    db.session.commit()
    return {}

def channels_details(token, channel_id):
    """
        Given a Channel with ID channel_id that the authorised user is
        part of, provide basic details about the channel
        Parameters:
            token       (str)
            channel_id  (channel_id)
        Returns:
            { name, description, owner_members, all_members }    (dict)
        Where:
            owner_members: [{ user_id, username, email, profile_img_url }, ...]  (list of user objects)
            all_members: [{ user_id, username, email, profile_img_url }, ...]    (list of user objects)
    """
    verify_token(token)
    user = get_user_from_token(token)
    if not user:
        raise AccessError(description="Invalid Token")
    selected_channel = select_channel(channel_id)
    if not selected_channel:
        raise InputError(description=f"{channel_id} doesn't point to a valid channel")
    # Raise exception when the user is not a member of the channel with the given channel_id
    if not is_user_member(user, selected_channel):
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    channel_owners = []
    channel_members = []
    # Joining User with MemberOf, then filtering for users associated with the selected channel 
    # TODO: Possible optimisation -> swap the ordering of the filtering
    memberships = db.session.query(User, MemberOf, Channel).outerjoin(MemberOf, MemberOf.user_id==User.id).outerjoin(Channel, Channel.id==MemberOf.channel_id).filter_by(id=channel_id).all()    
    for each_membership in memberships:
        curr_member = each_membership[0]
        member_data = {
            "user_id": curr_member.id,
            "name_first": curr_member.username,
            "profile_img_url": curr_member.bio.profile_img_url
        }
        channel_members.append(member_data)
        if each_membership[1].is_owner:
            channel_owners.append(member_data)
    
    details = {
        "name": selected_channel.name,
        "description": selected_channel.description,
        "owner_members": channel_owners,
        "all_members": channel_members
    }
    printColour("Results: {}".format(details), colour="blue")
    return details


def channels_messages(token, channel_id, start, limit=50):
    """
        Given a channel that the user is a member of, returns up to a specified maximum
        number of messages from a starting index. Messages are ordered in ascending
        recency, so the message at index 0 is the most recent.
        Parameters:
            token      (str)
            channel_id (int)
            start      (int)
            limit      (int)
        Returns:
            { messages, exhausted }
        Where:
            messages: list of message dictionary: { message_id, user_id, message, time_created, is_author }
            exhausted: bool indicating whether the there any more messages left to fetch 
    """
    # check parameters are all valid and raise exception if they aren't
    # add user_id, associated first name and last name into channel_id dictionary (or storage)
    verify_token(token)
    user = get_user_from_token(token)
    if not user:
        raise AccessError(description="Invalid Token")
    selected_channel = select_channel(channel_id)
    if not selected_channel:
        raise InputError(description="Channel ID is not a valid channel")
    if is_user_member(user, selected_channel) is False:
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    # Loop through 50 message dictionaries of list starting from start index
    messsages_list = selected_channel.messages_sent
    
    payload = {
        "messages": [],
        "exhausted": True
    }
    
    if not messsages_list:
        printColour("Results: {}".format(payload), colour="blue")
        return payload
    if start >= len(messsages_list):
        raise InputError(description="Starting index is greater than or equal to the total number of messages in the channel")
    if not (start + limit >= len(messsages_list)):
        messages["exhausted"] = False
    
    for i, message in enumerate(messsages_list[start :], start=1):
        payload["messages"].append({
            "message_id": message.id,
            "user_id": message.user_id,
            "message": message.message,
            "time_created": message.time_created.timestamp(),
            "is_author": message.user_id == user.id
        })
        if i == limit:
            break
    printColour("Results: {}".format(payload), colour="blue")
    return payload

def channels_leave(token, channel_id):
    """
        Removes the caller from the specified channel.
        Parameters:  
            token      (str)
            channel_id (str)
        Returns: 
            {}
    """
    verify_token(token)
    user = get_user_from_token(token)
    if not user:
        raise AccessError(description="Invalid Token")
    channels_list = Channel.query.all()
    selected_channel = select_channel(channel_id)
    # Check if Channel ID is not a valid channel
    if not selected_channel:
        raise InputError(description="Channel ID is not a valid channel")
    # Check user if the user is not currently a member of the selected channel
    if not is_user_member(user, selected_channel):
        raise AccessError(description="Authorised user is not a member of channel with channel_id")

    membership = MemberOf.query.filter_by(user_id=user.id, channel_id=selected_channel.id).first()
    db.session.delete(membership)
    db.session.commit()
    # If the user attempting to leave is the owner... Pass down ownership to someone else? Or delete channel
    # TODO:
    # If there is no members left in channel, delete channel
    # TODO:
    return {}

def channels_join(token, channel_id):
    """
        Given a channel_id of a channel that the authorised user can join, adds them to that channel
        Parameters:  
            token      (str)
            channel_id (int)
        Returns:
            {}
    """
    verify_token(token)
    user = get_user_from_token(token)
    if not user:
        raise AccessError(description="Invalid Token")
    selected_channel = select_channel(channel_id)
    if not selected_channel:
        raise InputError(description="Channel ID is not a valid channel")
    # Check whether channel is private or not. Raise AccessError if it is
    if not selected_channel.visibility == "public":
        raise AccessError(description="channel_id refers to a channel that is private.")

    new_membership = MemberOf(
        user=user,
        channel=selected_channel,
        is_owner=False
    )
    db.session.add(new_membership)
    db.session.commit()
    return {}

def channels_addowner(token, channel_id, user_id):
    """
        Make user with user id user_id an owner of this channel
        Returns: empty dict
        Errors: InputError on invalid channel_id
                InputError when user_id already has ownership over a
                channel before calling channel_addowner
                AccessError when the user isn't an owner of the
                slackr or an owner of this channel
    """
    verify_token(token)
    #identify user from token
    calling_user = get_user_from_token(data, token)
    if not calling_user:
        raise AccessError(description="Invalid Token")
    users_list = data["users"]

    selected_channel = select_channel(channel_id)
    if not selected_channel:
        raise InputError(description="Channel ID is not a valid channel")

    # check whether user_id is already owner in channel
    is_auth_owner = False
    is_user_owner = False
    owners_list = selected_channel["owner_members"]
    for owner in owners_list:
        if owner["user_id"] == user_id:
            is_user_owner = True
        elif owner["user_id"] == calling_user["user_id"]:
            is_auth_owner = True

    if is_user_owner is True:
        error = "When user with user id user_id is already an owner of the channel"
        raise InputError(description=error)

    if not is_auth_owner:
        error = "authorised user is not an owner of the slackr or owner of the channel"
        raise AccessError(description=error)

    user_to_add = get_user_from_id(users_list, user_id)[2]
    selected_channel["owner_members"].append(user_to_add)
    return {
    }

def channels_removeowner(token, channel_id, user_id):
    """
        Desc:    Remove user with user id user_id an owner of this channel
        Params:  (token, channel_id, user_id)
        Returns: empty dict
        Errors: InputError on invalid channel_id
                InputError when user_id DOESN'T already have ownership over
                a channel before calling channel_removeowner
                AccessError when the user isn't an owner of the
                slackr or an owner of this channel

        TYPES:
        token             str
        channel_id        int
        user_id              int
    """
    verify_token(token)
    #identify user from token
    calling_user = get_user_from_token(data, token)
    if not calling_user:
        raise AccessError(description="Invalid Token")
    users_list = data["users"]

    selected_channel = select_channel(data, channel_id)
    if not selected_channel:
        raise InputError(description="Channel ID is not a valid channel")

    # check whether user_id is already owner in channel
    is_auth_owner = False
    is_user_owner = False
    for owner in selected_channel["owner_members"]:
        if owner["user_id"] == user_id:
            is_user_owner = True
        if owner["user_id"] == calling_user["user_id"]:
            is_auth_owner = True

    if is_user_owner is False:
        raise InputError(description="When user with user id user_id is not an owner of the channel")

    if not is_auth_owner:
        error = "authorised user is not an owner of the slackr or owner of the channel"
        raise AccessError(description=error)

    # Get user information from
    user_to_remove = get_user_from_id(users_list, user_id)[2]
    owner_l = [o for o in selected_channel["owner_members"] if o["user_id"] != user_to_remove["user_id"]]
    selected_channel["owner_members"] = owner_l

    return {
    }

def channels_listall(token):
    """
        Provide a list of all channels (and their associated details)
        Parameters:
            token   (str)
        Returns: 
            { channels }
        Where:
            List of dictionaries: { channel_id, name, description, visibility, member_of, owner_of }
    """
    verify_token(token)
    user = get_user_from_token(token)
    channels_list = []
    all_channels = Channel.query.all()
    for each_channel in all_channels:
        curr_channel_data = {
            "channel_id": each_channel.id,
            "name": each_channel.name,
            "description": each_channel.description,
            "visibility": each_channel.visibility,
            "member_of": False,
            "owner_of": False
        }
        memberships = each_channel.channel_membership
        for membership in memberships:
            if membership.user_id == user.id:
                curr_channel_data["member_of"] = True
                if membership.is_owner:
                    curr_channel_data["owner_of"] = True 
        channels_list.append(curr_channel_data)
    printColour("Results: {}".format(channels_list), colour="blue")
    return {
        "channels": channels_list
    }

def channels_create(token, name, description, channel_image, visibility):
    """
        Creates a new channel with that name that is either a public or private channel. The created channel object
        has the following fields: { channel_id, name, description, visibility }
        Parameters:
            token       (str)
            name        (str)
            description (str)
            visibility  (bool)
        Raises: TODO
        Returns: 
            { channel_id }
    """
    verify_token(token)
    if len(name) > 30:
        raise InputError
    
    creator = get_user_from_token(token)
    new_channel = Channel(
        visibility=visibility,
        name=name,
        description=description
    )
    ownership = MemberOf(
        user=creator,
        channel=new_channel,
        is_owner=True
    )
    db.session.add(new_channel)
    db.session.add(ownership)
    db.session.commit()
    return {
        'channel_id': new_channel.id
    }
