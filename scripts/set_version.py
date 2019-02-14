#!/usr/bin/env python3
import json
import sys
import os

project_dir = os.path.realpath(os.path.dirname(os.path.dirname(sys.argv[0])))
version_full, version_major, version_minor, version_patch = (None, ) * 4

if len(sys.argv) == 2:
    version_full = sys.argv[1]
    version_major, version_minor, version_patch = version_full.split('.')
else:
    version_major = sys.argv[1]
    version_minor = sys.argv[2]
    version_patch = sys.argv[3]
    version_full = '.'.join([version_major, version_minor, version_patch])

sys.stderr.write('version: major={}, minor={}, patch={}, version_full: {}\n'.format(version_major, version_minor, version_patch, version_full))

if 'SKIP_CMAKE' not in os.environ:
    with open(os.path.join(project_dir, 'project_version.cmake'), 'w') as cmake_version_file:
        cmake_version_file.write('set(ASTRO_PHOTO_PLUS_PROJECT_VERSION {})\n'.format(version_full))

frontend_package_json = None
with open('frontend/package.json', 'r') as frontend_json_file:
    frontend_package_json = json.load(frontend_json_file)
frontend_package_json['version'] = version_full

with open('frontend/package.json', 'w') as frontend_json_file:
    json.dump(frontend_package_json, frontend_json_file, indent=4, sort_keys=True)

with open('backend/version.json', 'w') as backend_json_file:
    json.dump({
        'version': version_full,
        'version_major': version_major,
        'version_minor': version_minor,
        'version_patch': version_patch,
    }, backend_json_file, indent=4, sort_keys=True)


