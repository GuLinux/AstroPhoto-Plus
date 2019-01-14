import os

def clean_environment():
    env = dict(os.environ)
    del env['VIRTUAL_ENV']
    del env['PYTHONPATH']
    env['PATH'] = os.pathsep.join([p for p in env['PATH'].split(os.pathsep) if os.path.join('AstroPhoto+', 'python-venv') not in p])
    return env


