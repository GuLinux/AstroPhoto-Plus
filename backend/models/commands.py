from .model import random_id
import subprocess
import json
import os
from .settings import settings
from .exceptions import NotFoundError, BadRequestError, FailedMethodError
from app import logger

class Command:
    def __init__(self, obj, readonly=False):
        self.id = random_id(obj.get('id'))
        self.name = obj['name']
        self.category = obj.get('category', 'Misc')
        self.arguments = obj.get('arguments', [])
        self.readonly = readonly
        self.ui_properties = obj.get('ui_properties', None)
        self.confirmation_message = obj.get('confirmation_message', None)
        self.request_parameters = self.__build_request_parameters(obj.get('request_parameters', None))
        self._check = obj.get('check', None)

    def __build_request_parameters(self, request_parameters):
        if not request_parameters or not 'variables' in request_parameters:
            return None

        def get_parameters_dict(variable):
            if 'get_default_value' in variable:
                try:
                    result = subprocess.run(variable['get_default_value'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
                    if result.stderr:
                        logger.debug(result.stderr.decode())
                    variable['default_value'] = result.stdout.decode()
                except Exception as e:
                    logger.warning('error getting default value for variable {}: %s'.format(variable), e)
            return variable

        variables = [get_parameters_dict(v) for v in request_parameters['variables']]
        request_parameters.update({ 'variables': variables })
        return request_parameters

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'arguments': self.arguments,
            'readonly': self.readonly,
            'ui_properties': self.ui_properties,
            'confirmation_message': self.confirmation_message,
            'request_parameters': self.request_parameters,
            'check': self._check
        }

    def check(self):
        if not self._check:
            return True
        try:
            result = subprocess.run(self._check, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
            return result.returncode == 0
        except:
            return False

    def run(self, request_obj):
        subprocess_env = os.environ
        arguments = self.arguments.copy()
        logger.debug('arguments: {}'.format(arguments))
        if 'parameters' in request_obj:
            logger.debug('parameters: {}'.format(request_obj['parameters']))
            arguments.extend([p['value'] for p in request_obj['parameters']])
        logger.debug('arguments: {}'.format(arguments))

        try:
            result = subprocess.run(arguments, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
            return {
                'exit_code': result.returncode,
                'stdout': result.stdout.decode() if result.stdout else None,
                'stderr': result.stderr.decode() if result.stderr else None,
            }
        except Exception as e:
            raise FailedMethodError(str(e))

class Commands:
    def __init__(self):
        commands = []
        ro_commands_file = os.path.join(settings.config_dir, 'commands.json')
        if os.path.isfile(ro_commands_file):
            with open(ro_commands_file, 'r') as json_commands_file:
                commands.extend(json.load(json_commands_file))
        self._commands = [Command(c, readonly=True) for c in commands]

    @property
    def commands(self):
        return [c for c in self._commands if c.check()]

    def to_map(self):
        return [c.to_map() for c in self.commands] 

    def run(self, command_id, request_obj):
        commands = [c for c in self.commands if c.id == command_id]
        if not commands:
            raise NotFoundError('Command with id {} not found'.format(command_id))

        command = commands[0]
        return command.run(request_obj)

commands = Commands()

