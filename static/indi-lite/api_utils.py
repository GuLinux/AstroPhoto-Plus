from flask import jsonify
def api_error(code, title, message=None):
    return jsonify({
        'error': title,
        'error_message': message
    }), code

