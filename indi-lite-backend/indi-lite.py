from flask import Flask, jsonify
from api_decorators import *
from api_utils import *
from models import Server

app = Flask(__name__)

servers = {}

@app.route('/api/servers', methods=['GET'])
@json_api
def get_servers():
    return dict([(k, servers[k].to_map()) for k in servers])


@app.route('/api/servers', methods=['POST'])
@json_input
@json_api
def new_server(json):
    try:
        new_server = Server(json['host'], json.get('port', Server.DEFAULT_PORT))
        servers[new_server.id] = new_server
        return new_server.to_map()
    except KeyError:
        raise BadRequestError()


@app.route('/api/servers/<server>/connect', methods=['PUT'])
@json_api
def connect_server(server):
    if server not in servers:
        raise NotFoundError('Server {} not found'.format(server))
    server = servers[server]
    server.connect()
    timeout(5)(server.is_connected)()
    return server.to_map()

    
