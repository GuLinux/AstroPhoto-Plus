from flask import jsonify, Response
from api_decorators import *
from api_utils import *
from models import Server, Session, Sequence, NotFoundError, Property, Device
import os
from controller import controller
from app import app

app.logger.info('Using INDI server at %s:%d', controller.indi_server.host, controller.indi_server.port)

@app.route('/api/events')
def events():
    return Response(controller.sse.subscribe().feed(), mimetype='text/event-stream')

@app.route('/api/server/status', methods=['GET'])
@json_api
def get_server_status():
    return controller.indi_server.to_map()


@app.route('/api/server/connect', methods=['PUT'])
@json_api
def connect_server():
    controller.indi_server.connect()
    is_error = not timeout(5)(controller.indi_server.is_connected)()
    return notify('indi_server', 'indi_server_connect', controller.indi_server.to_map(), is_error)
 
@app.route('/api/server/disconnect', methods=['PUT'])
@json_api
@indi_connected
def disconnect_server():
    controller.indi_server.disconnect()
    is_error = not timeout(5)(lambda: not controller.indi_server.is_connected())()
    return notify('indi_server', 'indi_server_disconnect', controller.indi_server.to_map(), is_error)


@app.route('/api/server/devices', methods=['GET'])
@json_api
@indi_connected
def get_devices():
    return [x.to_map() for x in controller.indi_server.devices()]


@app.route('/api/server/devices/<name>/properties', methods=['GET'])
@json_api
@indi_connected
def get_device_properties(name):
    device = controller.indi_server.device(name=name)
    return [p.to_map() for p in device.properties()]


@app.route('/api/server/devices/<device>/properties/<property_name>', methods=['PUT'])
@json_input
@json_api
@indi_connected
def update_indi_property(device, property_name, json):
    app.logger.debug('update property: {}/{} ({})'.format(device, property_name, json))
    indi_property = controller.indi_server.property(device=device, name=property_name)
    return { 'action': 'set_property', 'device': device, 'property': property_name, 'values': json, 'result': indi_property.set_values(json) }


# TODO: this might prove to be useless 
@app.route('/api/cameras', methods=['GET'])
@json_api
@indi_connected
def get_cameras():
    return [x.to_map() for x in controller.indi_server.cameras()]
  

@app.route('/api/sessions', methods=['GET'])
@json_api
def get_sessions():
    return [x.to_map() for x in controller.sessions]

def find_session(id):
    session = [x for x in controller.sessions if x.id == id]
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
    controller.sessions = [x for x in controller.sessions if x.id != id]
    return session


@app.route('/api/sessions', methods=['POST'])
@json_input
@json_api
def new_session(json):
    new_session = Session(json['name'])
    controller.sessions.append(new_session)
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

