from flask import Flask
import json
import os



REDIS_HOST = os.environ.get('REDIS_SERVER', '127.0.0.1')
REDIS_PORT = int(os.environ.get('REDIS_PORT', '6379'))

static_folder = os.path.abspath(os.environ.get('ASTROPHOTO_PLUS_STATIC_FOLDER', '../frontend'))
has_static_folder = os.path.isfile(os.path.join(static_folder, 'index.html'))


app = Flask('AstroPhoto Plus', static_folder=None)
app.config['has_static_folder'] = has_static_folder
app.config['static_folder'] = static_folder
app.config['REDIS_URL'] = 'redis://{}:{}/'.format(REDIS_HOST, REDIS_PORT)

with open('version.json', 'r') as version_json:
    app.config['version'] = json.load(version_json)

logger = app.logger


from broadcast_service import broadcast_service
broadcast_service()
