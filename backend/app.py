from flask import Flask
import json


app = Flask('StarQuew')
with open('version.json', 'r') as version_json:
    app.config['version'] = json.load(version_json)

logger = app.logger

