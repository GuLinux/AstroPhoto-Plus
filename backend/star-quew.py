from flask import jsonify, Response
from api_decorators import *
from api_utils import *
from models import Server, Sequence, SequenceItem, NotFoundError, Property, Device
import os
from controller import controller
from app import app
import logging

default_settings = {}

app.logger.info('Using INDI server at %s:%d', controller.indi_server.host, controller.indi_server.port)
app.config['SEQUENCES_PATH'] = os.environ.get('STARQUEW_SEQUENCES_PATH', os.path.join(os.environ['HOME'], 'StarQuew'))

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers

app.logger.setLevel(os.environ.get('LOG_LEVEL', 'DEBUG'))

controller.load_sequences()

@app.route('/api/events')
def events():
    return Response(controller.sse.subscribe().feed(), mimetype='text/event-stream')

# INDI Methods

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


@app.route('/api/cameras', methods=['GET'])
@json_api
@indi_connected
def get_cameras():
    return [x.to_map() for x in controller.indi_server.cameras()]
  

# Sequences

@app.route('/api/sequences', methods=['GET'])
@json_api
def get_sequences():
    return [x.to_map() for x in controller.sequences]


@app.route('/api/sequences/<id>', methods=['GET'])
@json_api
def get_sequence(id):
    return controller.sequences.lookup(id).to_map()


@app.route('/api/sequences/<id>', methods=['DELETE'])
@json_api
def delete_sequence(id):
    sequence = controller.sequences.lookup(id)
    sequence_json = sequence.to_map()
    sequence_json.update({'status': 'deleted'})
    controller.sequences.remove(sequence)
    return sequence_json


@app.route('/api/sequences', methods=['POST'])
@json_input
@json_api
def new_sequence(json):
    try:
        new_sequence = Sequence(json['name'], json['directory'], json['camera'])
        controller.sequences.append(new_sequence)
        return new_sequence.to_map()
    except KeyError:
        raise BadRequestError('Invalid json')


@app.route('/api/sequences/<id>/start', methods=['POST'])
@json_api
def start_sequence(id):
    controller.sequences_runner.run(id)
    return { 'id': id, 'status': 'starting' }

# Sequence Items

@app.route('/api/sequences/<id>/sequence_items', methods=['POST'])
@json_input
@json_api
def add_sequence_item(id, json):
    new_sequence_item = SequenceItem(json)
    with controller.sequences.lookup_edit(id) as sequence:
        app.logger.debug('adding sequence item {} to id {}'.format(new_sequence_item, id))
        sequence.sequence_items.append(new_sequence_item)
    return new_sequence_item.to_map()


@app.route('/api/sequences/<sequence_id>/sequence_items/<sequence_item_id>', methods=['PUT'])
@json_input
@json_api
def update_sequence_item(sequence_id, sequence_item_id, json):
    app.logger.debug('modifying sequence item {} from sequence'.format(sequence_item_id, sequence_id))
    new_sequence_item = SequenceItem(json)
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        sequence.sequence_items = [x for x in sequence.sequence_items if x.id != sequence_item_id]
        sequence.sequence_items.append(new_sequence_item)
    return new_sequence_item.to_map()


    
@app.route('/api/sequences/<sequence_id>/sequence_items/<sequence_item_id>', methods=['DELETE'])
@json_api
def delete_sequence_item(sequence_id, sequence_item_id):
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        sequence_item = sequence.item(sequence_item_id)
        sequence_item = sequence_item.to_map()
        sequence_item.update({'status': 'deleted'})
        sequence.sequence_items = [x for x in sequence.sequence_items if x.id != sequence_item_id]
        return sequence_item

