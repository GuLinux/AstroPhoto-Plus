from flask import jsonify
def api_error(code, title, message=None):
    return jsonify({
        'error': title,
        'error_message': message
    }), code


def api_bad_json_error(message=None):
    return api_error(400, 'Bad Request', message if message else 'Invalid JSON request')

class BadRequestError(Exception):
    def __init__(self, message=None):
        Exception.__init__(self,message)
        self.message = message

