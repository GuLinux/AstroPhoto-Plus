from .model import random_id
import subprocess
import json
import os
from .settings import settings
from .exceptions import NotFoundError, BadRequestError

class Command:
    def __init__(self, obj, readonly=False):
        self.id = random_id(obj.get('id'))
        self.name = obj['name']
        self.category = obj.get('category', 'Misc')
        self.program = obj['program']
        self.arguments = obj.get('arguments', [])
        self.readonly = readonly
        self.ui_properties = obj.get('ui_properties', None)

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'program': self.program,
            'arguments': self.arguments,
            'readonly': self.readonly,
            'ui_properties': self.ui_properties,
        }

    def run(self):
        args = [self.program]
        args.extend(self.arguments)
        result = subprocess.run(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        return {
            'exit_code': result.returncode,
            'stdout': result.stdout.decode() if result.stdout else None,
            'stderr': result.stderr.decode() if result.stderr else None,
        }
    

class Commands:
    def __init__(self):
        commands = []
        ro_commands_file = os.path.join(settings.config_dir, 'commands.json')
        if os.path.isfile(ro_commands_file):
            with open(ro_commands_file, 'r') as json_commands_file:
                commands.extend(json.load(json_commands_file))
        self.commands = [Command(c, readonly=True) for c in commands]

    def to_map(self):
        return [c.to_map() for c in self.commands]

    def run(self, command_id):
        commands = [c for c in self.commands if c.id == command_id]
        if not commands:
            raise NotFoundError('Command with id {} not found'.format(command_id))

        command = commands[0]
        return command.run()

commands = Commands()

