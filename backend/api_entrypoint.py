from flask import jsonify, Response, send_from_directory, send_file, request
from app import app
from catalogs import catalog_importer, catalogs
import logging
from skychart import skychart
import os
# Init logger, before we import anything else
gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers

is_debug_mode = int(os.environ.get('DEV_MODE', '0')) == 1
app.logger.setLevel(os.environ.get('LOG_LEVEL', 'DEBUG' if is_debug_mode else 'WARNING' ))

if is_debug_mode and os.environ.get('ENABLE_PTVSD', '0').lower() in ['1', 'true']:
    import ptvsd
    app.logger.debug('ptvsd: waiting for connection')
    ptvsd.enable_attach(address=('0.0.0.0', 5678), redirect_output=True)
    ptvsd.wait_for_attach()
    app.logger.debug('ptvsd: attached to remote debugger')


from api_decorators import *
from api_utils import *
from indi import Server, Property, Device, INDIProfile
from errors import NotFoundError
from images import ImagesDatabase, camera_images_db, main_images_db
from system import commands, controller, settings
from sequences import Sequence, SequenceJob

import io
import json

settings.update_log_level()

def arg_bool(request, arg, default_value=False):
    return request.args.get(arg, 'true' if default_value else 'false') == 'true' or request.args.get(arg) == '1'


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if not app.config['has_static_folder']:
        return 'Resource not found: {}'.format(path), 405
    static_file = path
    if not os.path.isfile(os.path.join(app.config['static_folder'], path)):
        static_file = 'index.html'
    return send_from_directory(app.config['static_folder'], static_file)


@app.route('/api/version')
@json_api
def backend_version():
    return app.config['version']

@app.route('/api/events')
def events():
    response = Response(controller.sse.subscribe().feed(), mimetype='text/event-stream')
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/api/settings', methods=['GET'])
@json_api
def get_settings():
    return controller.settings.to_map()

@app.route('/api/settings', methods=['PUT'])
@json_input
@json_api
def update_settings(json):
    controller.settings.update(json)
    updated_settings = controller.settings.to_map()
    return dict([setting for setting in updated_settings.items() if setting[0] in json])

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
        controller.indi_service.start(json['drivers'])
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
        new_indi_profile = INDIProfile(name=json['name'], drivers=json['drivers'])
        controller.indi_profiles.append(new_indi_profile)
        return new_indi_profile.to_map()
    except KeyError:
        raise BadRequestError('Invalid json')

@app.route('/api/indi_profiles/<id>', methods=['PUT'])
@json_input
@json_api
def update_indi_profile(id, json):
    updated_profile = None
    with controller.indi_profiles.lookup_edit(id) as profile:
        profile.update(json)
        updated_profile = profile.to_map()
    return updated_profile

# INDI Methods

@app.route('/api/server/status', methods=['GET'])
@json_api
def get_server_status():
    return controller.indi_server.to_map()


@app.route('/api/server/connect', methods=['PUT'])
@json_api
def connect_server():
    controller.indi_server.connect()
    timeout(5)(controller.indi_server.is_connected)()
    return controller.indi_server.to_map()

@app.route('/api/server/disconnect', methods=['PUT'])
@json_api
@indi_connected
def disconnect_server():
    controller.indi_server.disconnect()
    timeout(5)(lambda: not controller.indi_server.is_connected())()
    return controller.indi_server.to_map() 


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
    app.logger.info('update property: {}/{} ({})'.format(device, property_name, json))
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
    controller.sequences.lookup(id).to_map()

@app.route('/api/sequences/<id>/export', methods=['GET'])
@managed_api
def export_sequence(id):
    sequence = controller.sequences.lookup(id).to_map()
    fileobj = io.BytesIO(json.dumps(sequence, sort_keys=True, indent=4).encode())
    return send_file(fileobj, 'application/json', as_attachment=True, attachment_filename='{}.json'.format(sequence['name']))


@app.route('/api/sequences/import', methods=['POST'])
@json_input
@json_api
def import_sequence(json):
    sequence = Sequence.import_from_data(json)
    controller.sequences.append(sequence)
    return sequence.to_map()


# TODO: cleanup all resources, such as sequence jobs and images
@app.route('/api/sequences/<id>', methods=['DELETE'])
@json_api
def delete_sequence(id):
    sequence = controller.sequences.lookup(id)
    sequence.on_deleted(remove_files=arg_bool(request, 'remove_files'))
    controller.sequences.remove(sequence)
    return sequence.to_map()


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


@app.route('/api/sequences/<id>', methods=['PUT'])
@json_input
@json_api
def edit_sequence(id, json):
    try:
        with controller.sequences.lookup_edit(id) as sequence:
            sequence.update(json)
            return sequence.to_map()
    except KeyError:
        raise BadRequestError('Invalid json')




@app.route('/api/sequences/<id>/start', methods=['POST'])
@json_api
def start_sequence(id):
    controller.sequences_runner.run(id)
    return controller.sequences.lookup(id).to_map()


@app.route('/api/sequences/<id>/stop', methods=['POST'])
@json_api
def stop_sequence(id):
    running_sequence = controller.sequences_runner.get(id)
    if not running_sequence:
        raise BadRequestError('Sequence with id {} not running'.format(id))
    running_sequence.stop()
    return running_sequence.sequence.to_map()


@app.route('/api/sequences/<id>/reset', methods=['POST'])
@json_input
@json_api
def reset_sequence(id, json):
    with controller.sequences.lookup_edit(id) as sequence:
        if sequence.is_running():
            raise BadRequestError('Sequence with id {} running, cannot reset'.format(id))
        sequence.reset(remove_files=json.get('remove_files', False), jobs_to_reset=json.get('jobs_to_reset', []))
        return sequence.to_map()


@app.route('/api/sequences/<id>/duplicate', methods=['POST'])
@json_api
def duplicate_sequence(id):
    return controller.sequences.duplicate(id).to_map()


# Sequence Jobs

@app.route('/api/sequences/<id>/sequence_jobs', methods=['POST'])
@json_input
@json_api
def add_sequence_job(id, json):
    new_sequence_job = SequenceJob(json)
    with controller.sequences.lookup_edit(id) as sequence:
        app.logger.info('adding sequence job {} to id {}'.format(new_sequence_job, id))
        sequence.sequence_jobs.append(new_sequence_job)
    return new_sequence_job.to_map()


@app.route('/api/sequences/<sequence_id>/sequence_jobs/<sequence_job_id>', methods=['PUT'])
@json_input
@json_api
def update_sequence_job(sequence_id, sequence_job_id, json):
    app.logger.info('modifying sequence job {} from sequence'.format(sequence_job_id, sequence_id))
    new_sequence_job = SequenceJob(json)
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        sequence.sequence_jobs = [new_sequence_job if x.id == sequence_job_id else x for x in sequence.sequence_jobs]
    return new_sequence_job.to_map()


@app.route('/api/sequences/<sequence_id>/sequence_jobs/<sequence_job_id>/move', methods=['PUT'])
@json_input
@json_api
def move_sequence_job(sequence_id, sequence_job_id, json):
    app.logger.info('moving sequence job {}: direction: {}'.format(sequence_job_id, json['direction']))
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        index = [ index for index, job in enumerate(sequence.sequence_jobs) if job.id == sequence_job_id]
        if not index:
            raise NotFoundError('Sequence job {} not found in sequence {}'.format(sequence_job_id, sequence_id))
        index = index[0]
        new_index = index-1 if json['direction'] == 'up' else index+1
        if new_index >= 0 and new_index < len(sequence.sequence_jobs):
            sequence.sequence_jobs.insert(new_index, sequence.sequence_jobs.pop(index))
        return sequence.to_map()



@app.route('/api/sequences/<sequence_id>/sequence_jobs/<sequence_job_id>/duplicate', methods=['PUT'])
@json_api
def duplicate_sequence_job(sequence_id, sequence_job_id):
    app.logger.info('duplicate job {}'.format(sequence_job_id))
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        sequence_job = sequence.job(sequence_job_id)
        sequence.sequence_jobs.append(sequence_job.duplicate())
        return sequence.to_map()




@app.route('/api/sequences/<sequence_id>/sequence_jobs/<sequence_job_id>', methods=['DELETE'])
@json_api
def delete_sequence_job(sequence_id, sequence_job_id):
    with controller.sequences.lookup_edit(sequence_id) as sequence:
        sequence_job = sequence.job(sequence_job_id)
        sequence_job.on_deleted(remove_files=arg_bool(request, 'remove_files'))
        sequence.sequence_jobs = [x for x in sequence.sequence_jobs if x.id != sequence_job_id]
        return sequence_job.to_map()

#imaging module


@app.route('/api/cameras', methods=['GET'])
@json_api
@indi_connected
def get_cameras():
    return [x.to_map() for x in controller.indi_server.cameras()]


def lookup_camera(id):
    camera = [c for c in controller.indi_server.cameras() if c.id == id]
    if not camera:
        raise NotFoundError('Camera {} not found'.format(id))
    return camera[0]


@app.route('/api/cameras/<camera>/image', methods=['POST'])
@json_input
@json_api
@indi_connected
def shoot_image(camera, json):
    return lookup_camera(camera).shoot_image(json)


def get_image_database(type):
    image_databases = {
        'camera': camera_images_db,
        'main': main_images_db,
    }
    if not type in image_databases:
        raise BadRequestError('Image type {} not recognized'.format(type))
    return image_databases[type]

@app.route('/api/images/<type>/<image>/wait_until_ready', methods=['GET'])
@json_api
def wait_for_image(type, image):
    get_image_database(type).lookup(image, file_required=False).wait_until_ready()
    return { 'ready': True }

@app.route('/api/images/<type>/<image>/ready', methods=['GET'])
@json_api
def image_is_ready(type, image):
    if get_image_database(type).lookup(image, file_required=False).is_ready():
        return { 'ready': True }
    else:
        raise NotFoundError('Image with type {} and id {} not found'.format(type, image))


@app.route('/api/images/<type>', methods=['GET'])
@json_api
def retrieve_images(type):
    return get_image_database(type).to_map()

@app.route('/api/images/<type>/search', methods=['POST'])
@json_input
@json_api
def filter_images(type, json):
    return get_image_database(type).filter(json)

@app.route('/api/images/<type>/<image>', methods=['GET'])
@managed_api
def retrieve_image(type, image):
    with get_image_database(type).lookup_edit(image) as image:
        image_info = image.convert(request.args)
        return send_from_directory(
            image_info['directory'],
            image_info['filename'],
            mimetype=image_info['content_type'],
            as_attachment=request.args.get('download') == 'true',
            attachment_filename=image_info['filename'],
        )


@app.route('/api/images/<type>/<image>/histogram', methods=['GET'])
@json_api
def retrieve_image_histogram(type, image):
    image = get_image_database(type).lookup(image)
    args = {}
    if 'bins' in request.args:
        args['bins'] = request.args['bins']
    if 'range_int' in request.args:
        args['range_int'] = request.args['range_int'] != '0'
    return image.histogram(**args)

#telescope module


@app.route('/api/telescopes', methods=['GET'])
@json_api
@indi_connected
def get_telescopes():
    return [x.to_map() for x in controller.indi_server.telescopes()]

# astrometry module
@app.route('/api/platesolving', methods=['GET'])
@json_api
def get_platesolving():
    return controller.platesolving.to_map()


@app.route('/api/platesolving/solveField', methods=['POST'])
@json_input
@json_api
def platesolving_solve_field(json):
    return controller.platesolving.solve_field(json)

@app.route('/api/platesolving/abortSolveField', methods=['DELETE'])
@json_api
def platesolving_abort_solve_field():
    return controller.platesolving.abort()


@app.route('/api/platesolving/download_indexes', methods=['POST'])
@json_input
@json_api
def astrometry_download_indexes(json):
    return controller.astrometry_downloader.download(json['arcminutes'])


# filesystem
@app.route('/api/mkdir', methods=['POST'])
@json_input
@json_api
def browser_mkdir(json):
    try:
        path = json['path'] if 'path' in json else os.path.join(json['parent'], json['name'])
        os.makedirs(path)
        return {
            'parent': os.path.dirname(path),
            'name': os.path.basename(path),
            'path': path,
            'created': True,
        }
    except KeyError:
        raise BadRequestError('Invalid json')
    except Exception as e:
        raise BadRequestError(str(e))

@app.route('/api/directory_browser', methods=['GET'])
@json_api
def directory_browser():
    path=request.args.get('path', '/')
    if not os.path.exists(path):
        parent_dir = path
        while not os.path.isdir(parent_dir):
            parent_dir = os.path.dirname(parent_dir)
        raise NotFoundError("Directory {} doesn't exists".format(path), payload={ 'requested_path': path, 'redirect_to': parent_dir })

    if not os.path.isdir(path):
        raise BadRequestError('Path {} is not a directory'.format(path))

    entries = sorted(os.listdir(path))

    subdirectories = [dir for dir in entries if os.path.isdir(os.path.join(path, dir))]
    parent = os.path.dirname(path)
    response = {
        'path': os.path.normpath(path),
        'subdirectories': subdirectories,
        'parent': os.path.normpath(parent) if parent != path else None,
    }
    if request.args.get('show_files', 'false') == 'true':
        response['files'] = [dir for dir in entries if os.path.isfile(os.path.join(path, dir))]
    return response

# Run commands
@app.route('/api/commands', methods=['GET'])
@json_api
def get_available_commands():
    return commands.to_map()

@app.route('/api/commands/<id>/run', methods=['POST'])
@json_input
@json_api
def run_command(id, json):
    return commands.run(id, json)


# Catalog
@app.route('/api/catalogs', methods=['GET'])
@json_api
def get_catalogs():
    return catalogs.all()

@app.route('/api/catalogs/available', methods=['GET'])
@json_api
def get_available_catalogs():
    return catalog_importer.available_catalogs()


@app.route('/api/catalogs/import/<name>', methods=['POST'])
@json_api
def catalog_import(name):
    return catalog_importer.import_catalog(name)

@app.route('/api/catalogs/<catalog>/<name>', methods=['GET'])
@json_api
def catalog_lookup(catalog, name):
    return catalogs.lookup(catalog, name)

# Star Chart

def build_star_chart(options):
    try:
        return Response(skychart.chart(options), mimetype='image/svg+xml')
    except BadRequestError as e:
        return api_bad_request_error(e.message, e.payload) 

@app.route('/api/skychart', methods=['GET'])
def get_star_chart():
    app.logger.debug('sky chart: GET')
    options = dict(request.args)
    if 'markers' in options:
        options['markers'] = json.loads(options['markers'])
    return build_star_chart(options)


@app.route('/api/skychart', methods=['POST'])
@json_input
def post_star_chart(json):
    app.logger.debug('sky chart: POST')
    return build_star_chart(json)
