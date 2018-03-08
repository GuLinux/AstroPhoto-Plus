from flask import Flask, jsonify
from api_decorators import *
from api_utils import *
from models import Server, Session, Sequence

app = Flask(__name__)

app_status = {
    'server': Server('localhost'),
    'sessions': []
}

@app.route('/api/server/status', methods=['GET'])
@json_api
def get_server_status():
    return app_status['server'].to_map()


@app.route('/api/server/connect', methods=['PUT'])
@json_api
def connect_server():
    server = app_status['server']
    server.connect()
    timeout(5)(server.is_connected)()
    return server.to_map()

    
@app.route('/api/sessions', methods=['GET'])
@json_api
def get_sessions():
    return [x.to_map() for x in app_status['sessions']]


def find_session(id):
    session = [x for x in app_status['sessions'] if x.id == id]
    if session:
        return session[0]
    raise NotFoundError()

def find_sequence(session_id, sequence_id):
    session = find_session(session_id)
    sequence = [x for x in session.sequences if x.id == sequence_id]
    if sequence:
        return session, sequence[0]
    raise NotFoundError()

@app.route('/api/sessions/<id>', methods=['GET'])
@json_api
def get_session(id):
    return find_session(id).to_map()


@app.route('/api/sessions/<id>', methods=['DELETE'])
@json_api
def delete_session(id):
    session = find_session(id).to_map()
    session.update({'status': 'deleted'})
    app_status['sessions'] = [x for x in app_status['sessions'] if x.id != id]
    return session


@app.route('/api/sessions', methods=['POST'])
@json_input
@json_api
def new_session(json):
    new_session = Session(json['name'])
    app_status['sessions'].append(new_session)
    return new_session.to_map()


@app.route('/api/sessions/<id>/sequences', methods=['POST'])
@json_input
@json_api
def add_sequence(id, json):
    session = find_session(id)
    new_sequence = Sequence(json['name'])
    app.logger.debug('adding sequence {} to id {}'.format(new_sequence, id))
    session.sequences.append(new_sequence)
    return new_sequence.to_map()

    
@app.route('/api/sessions/<session_id>/sequences/<sequence_id>', methods=['DELETE'])
@json_api
def delete_sequence(session_id, sequence_id):
    session, sequence = find_sequence(session_id, sequence_id)
    sequence = sequence.to_map()
    sequence.update({'status': 'deleted'})
    session.sequences = [x for x in session.sequences if x.id != sequence_id]
    return sequence


