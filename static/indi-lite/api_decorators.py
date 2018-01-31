from flask import jsonify, request
from api_utils import *
from functools import wraps

def json_api(f):
    @wraps(f)
    def f_wrapper(*args, **kwargs):
        return jsonify(f(*args, **kwargs))
    return f_wrapper

def json_input(f):
    @wraps(f)
    def f_wrapper(*args, **kwargs):
        if not request.is_json:
            return api_error(400, 'Bad Request', 'Request not in JSON format')
        kwargs['json'] = request.json
        return f(*args, **kwargs)
    return f_wrapper

