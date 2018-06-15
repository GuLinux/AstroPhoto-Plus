from flask import jsonify
from controller import controller


def api_error(code, title, message=None):
    return jsonify({
        'error': title,
        'error_message': message
    }), code

def notify(event_type, event_name, payload, is_error=False):
    controller.notification(event_type, event_name, payload, is_error)
    return payload

def api_bad_json_error(message=None):
    return api_error(400, 'Bad Request', message if message else 'Invalid JSON request')

def api_bad_request_error(message=None):
    return api_error(400, 'Bad Request', message if message else 'Invalid Request')

def api_not_found_error(message=None):
    return api_error(404, 'Resource Not Found', message if message else 'The requested resource was not found on the server')

def api_failed_method_error(message=None):
    return api_error(500, 'Failed method', message if message else 'An error occured processing the request')
