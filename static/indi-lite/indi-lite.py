from flask import Flask, jsonify
from api_decorators import *

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
    return json

