#!/usr/bin/env python3
import requests
import os
from github import Github

workdir = os.path.abspath(os.path.dirname(__file__))
print(workdir)

with open(os.path.join(workdir, 'pi-gen/deploy/astrophotoplus.version'), 'r') as f:
    astrophotoplus_version = f.readline().strip()

release_file = [f for f in os.listdir(os.path.join(workdir, 'pi-gen/deploy')) if f.endswith('AstroPhoto-Plus-{}.zip'.format(astrophotoplus_version))]
if not release_file:
    raise RuntimeError('Zip file for AstroPhoto Plus version {} not found'.format(astrophotoplus_version))
release_file = release_file[0]
 
print('Pushing {} to {}'.format(release_file, astrophotoplus_version))
 
github = Github(os.environ['GITHUB_OAUTH_USER'], os.environ['GITHUB_OAUTH_TOKEN'])
repo = github.get_repo('GuLinux/AstroPhoto-Plus')
release = repo.get_release('v{}'.format(astrophotoplus_version))
print('Release found, uploading asset...')
release.upload_asset(os.path.join(workdir, 'pi-gen/deploy', release_file), 'Raspberry Pi Image')
print('Done.')

