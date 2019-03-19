from flask import jsonify
from system import controller


def api_error(code, title, message=None, payload=None):
    return jsonify({
        'error': title,
        'error_message': message,
        'payload': payload,
    }), code

def notify(event_type, event_name, payload, is_error=False):
    controller.event_listener.event(event_type, event_name, payload, is_error)
    return payload

def api_bad_json_error(message=None, payload=None):
    return api_error(400, 'Bad Request', message if message else 'Invalid JSON request', payload=payload)

def api_bad_request_error(message=None, payload=None):
    return api_error(400, 'Bad Request', message if message else 'Invalid Request', payload=payload)

def api_not_found_error(message=None, payload=None):
    return api_error(404, 'Resource Not Found', message if message else 'The requested resource was not found on the server', payload=payload)

def api_failed_method_error(message=None, payload=None):
    return api_error(500, 'Failed method', message if message else 'An error occured processing the request', payload=payload)
