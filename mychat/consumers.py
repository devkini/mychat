import re
import json
import logging
from channels import Group
from channels.sessions import channel_session

log = logging.getLogger(__name__)

@channel_session
def ws_connect(message):
    label = 'room'
    log.debug('chat connect room=%s client=%s:%s', 
        label, message['client'][0], message['client'][1])
    
    # Need to be explicit about the channel layer so that testability works
    # This may be a FIXME?
    Group('chat-'+label, channel_layer=message.channel_layer).add(message.reply_channel)

    message.channel_session['room'] = label

@channel_session
def ws_receive(message):
    label = 'room'
    # Parse out a chat message from the content text, bailing if it doesn't
    # conform to the expected message format.
    try:
        data = json.loads(message['text'])
    except ValueError:
        log.debug("ws message isn't json text=%s", text)
        return
    
    if set(data.keys()) != set(('nickname', 'text')):
        log.debug("ws message unexpected format data=%s", data)
        return

    if data:
        log.debug('chat message room=%s handle=%s message=%s', 
            label, data['nickname'], data['text'])

        m = {
            'room': 'room',
            'nickname': 'nick',
            'text': data['text'],
        }

        # See above for the note about Group
        Group('chat-'+label, channel_layer=message.channel_layer).send({'text': json.dumps(m)})

@channel_session
def ws_disconnect(message):
    label = 'room'
    Group('chat-'+label, channel_layer=message.channel_layer).discard(message.reply_channel)
