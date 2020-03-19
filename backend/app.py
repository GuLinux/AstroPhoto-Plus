from flask import Flask
import json
import os




static_folder = os.path.abspath(os.environ.get('ASTROPHOTO_PLUS_STATIC_FOLDER', '../frontend'))
has_static_folder = os.path.isfile(os.path.join(static_folder, 'index.html'))


app = Flask('AstroPhoto Plus', static_folder=None)
app.config['has_static_folder'] = has_static_folder
app.config['static_folder'] = static_folder


with open('version.json', 'r') as version_json:
    app.config['version'] = json.load(version_json)

logger = app.logger

from redis_server import RedisServer
redis_server = RedisServer()
redis_server.start()

REDIS_HOST = os.environ.get('REDIS_SERVER', '127.0.0.1')
REDIS_PORT = redis_server.port
app.config['REDIS_URL'] = 'redis://{}:{}/'.format(REDIS_HOST, REDIS_PORT)


from broadcast_service import broadcast_service
broadcast_service()
