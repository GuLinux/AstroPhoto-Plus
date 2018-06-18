from flask import jsonify, Response, send_from_directory, request
from api_decorators import *
from api_utils import *
from models import Server, Sequence, SequenceItem, NotFoundError, Property, Device, INDIProfile
import os
from controller import controller
from app import app
import logging
import io

default_settings = {}

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers

is_debug_mode = int(os.environ.get('DEV_MODE', '0')) == 1
app.logger.setLevel(os.environ.get('LOG_LEVEL', 'DEBUG' if is_debug_mode else 'INFO' ))


@app.route('/api/events')
def events():
    return Response(controller.sse.subscribe().feed(), mimetype='text/event-stream')

@app.route('/api/settings', methods=['GET'])
@json_api
def get_settings():
    return controller.settings.to_map()

@app.route('/api/settings', methods=['PUT'])
@json_input
@json_api
def update_settings(json):
    controller.settings.update(json)
    return controller.settings.to_map()

# INDI Server management

@app.route('/api/indi_service/status', methods=['GET'])
@json_api
def get_indi_service_status():
    return controller.indi_service.status()


@app.route('/api/indi_service', methods=['GET'])
@json_api
def get_indi_service():
    return controller.indi_service.to_map()


@app.route('/api/indi_service/start', methods=['POST'])
@json_input
@json_api
def start_indi_service(json):
    try:
        controller.indi_service.start(json['devices'])
        return { 'indi_service': 'starting' }
    except RuntimeError as e:
        raise BadRequestError(str(e))


@app.route('/api/indi_service/stop', methods=['POST'])
@json_api
def stop_indi_service():
    controller.indi_service.stop()
    return { 'indi_service': 'stopping' }

## INDI Profiles
@app.route('/api/indi_profiles', methods=['GET'])
@json_api
def get_indi_profiles():
    return [x.to_map() for x in controller.indi_profiles]


@app.route('/api/indi_profiles/<id>', methods=['GET'])
@json_api
def get_indi_profile(id):
    return controller.indi_profiles.lookup(id).to_map()


@app.route('/api/indi_profiles/<id>', methods=['DELETE'])
@json_api
def delete_indi_profile(id):
    indi_profile = controller.indi_profiles.lookup(id)
    indi_profile_json = indi_profile.to_map()
    indi_profile_json.update({'status': 'deleted'})
    controller.indi_profiles.remove(indi_profile)
    return indi_profile_json


@app.route('/api/indi_profiles', methods=['POST'])
@json_input
@json_api
def new_indi_profile(json):
    try:
        new_indi_profile = INDIProfile(name=json['name'], devices=json['devices'])
        controller.indi_profiles.append(new_indi_profile)
        return new_indi_profile.to_map()
    except KeyError:
        raise BadRequestError('Invalid json')

@app.route('/api/indi_profiles/<id>', methods=['PUT'])
@json_input
@json_api
def update_indi_profile(id, json):
    try:
        updated_profile = None
        with controller.indi_profiles.lookup_edit(id) as profile:
            profile.update(json)
            updated_profile = profile.to_map()
        return updated_profile
    except KeyError:
        raise BadRequestError('Invalid json')

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



@app.route('/api/filter_wheels', methods=['GET'])
@json_api
@indi_connected
def get_filter_wheels():
    return [x.to_map() for x in controller.indi_server.filter_wheels()]

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
        new_sequence = Sequence(json['name'], json['directory'], json['camera'], json.get('filterWheel'))
        controller.sequences.append(new_sequence)
        return new_sequence.to_map()
    except KeyError:
        raise BadRequestError('Invalid json')


@app.route('/api/sequences/<id>/start', methods=['POST'])
@json_api
def start_sequence(id):
    controller.sequences_runner.run(id)
    return { 'id': id, 'status': 'starting' }


@app.route('/api/sequences/<id>/duplicate', methods=['POST'])
@json_api
def duplicate_sequence(id):
    return controller.sequences.duplicate(id).to_map()


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
        sequence.sequence_items = [new_sequence_item if x.id == sequence_item_id else x for x in sequence.sequence_items]
    return new_sequence_item.to_map()


@app.route('/api/sequences/<sequence_id>/sequence_items/<sequence_item_id>/move', methods=['PUT'])
@json_input
@json_api
def move_sequence_item(sequence_id, sequence_item_id, json):
    app.logger.debug('moving sequence item {}: direction: {}'.format(sequence_item_id, json['direction']))
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        index = [ index for index, item in enumerate(sequence.sequence_items) if item.id == sequence_item_id]
        if not index:
            raise NotFoundError('Sequence item {} not found in sequence {}'.format(sequence_item_id, sequence_id))
        index = index[0]
        new_index = index-1 if json['direction'] == 'up' else index+1
        if new_index >= 0 and new_index < len(sequence.sequence_items):
            sequence.sequence_items.insert(new_index, sequence.sequence_items.pop(index))
        return sequence.to_map()



@app.route('/api/sequences/<sequence_id>/sequence_items/<sequence_item_id>/duplicate', methods=['PUT'])
@json_api
def duplicate_sequence_item(sequence_id, sequence_item_id):
    app.logger.debug('duplicate item {}'.format(sequence_item_id))
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        sequence_item = sequence.item(sequence_item_id)
        sequence.sequence_items.append(sequence_item.duplicate())
        return sequence.to_map()




@app.route('/api/sequences/<sequence_id>/sequence_items/<sequence_item_id>', methods=['DELETE'])
@json_api
def delete_sequence_item(sequence_id, sequence_item_id):
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        sequence_item = sequence.item(sequence_item_id)
        sequence_item = sequence_item.to_map()
        sequence_item.update({'status': 'deleted'})
        sequence.sequence_items = [x for x in sequence.sequence_items if x.id != sequence_item_id]
        return sequence_item

#imaging module


@app.route('/api/cameras', methods=['GET'])
@json_api
@indi_connected
def get_cameras():
    return [x.to_map() for x in controller.indi_server.cameras()]


def lookup_camera(id):
    camera = [c for c in controller.indi_server.cameras() if c.id == id]
    if not camera:
        raise NotFoundError('Camera {} not found'.format(json['camera']))
    return camera[0]


@app.route('/api/cameras/<camera>/image', methods=['POST'])
@json_input
@json_api
@indi_connected
def shoot_image(camera, json):
    return lookup_camera(camera).shoot_image(json)


@app.route('/api/cameras/<camera>/image/<image>', methods=['GET'])
@managed_api
@indi_connected
def retrieve_image(camera, image):
    image = lookup_camera(camera).images_list.lookup(image)
    image_info = image.convert(request.args)
    return send_from_directory(
        image_info['directory'],
        image_info['filename'],
        mimetype=image_info['content_type'],
        as_attachment=False,
        attachment_filename=image_info['filename'],
    )


@app.route('/api/cameras/<camera>/image/<image>/histogram', methods=['GET'])
@json_api
@indi_connected
def retrieve_image_histogram(camera, image):
    image = lookup_camera(camera).images_list.lookup(image)
    args = {}
    if 'bins' in request.args:
        args['bins'] = request.args['bins']
    return image.histogram(**args)
