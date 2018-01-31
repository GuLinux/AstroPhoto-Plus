from flask import Flask, jsonify
from api_decorators import *
from api_utils import *
from models import Server

app = Flask(__name__)

servers = []

@app.route('/api/servers', methods=['GET'])
@json_api
def get_servers():
    return {'servers': servers}

@app.route('/api/servers', methods=['POST'])
@json_input
@json_api
def new_server(json):
    try:
        new_server = Server(json['host'], json['port'])
        servers.append(new_server)
        return new_server.to_map()
    except KeyError:
        raise BadRequestError()
