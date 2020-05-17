#!/usr/bin/env python3
import os
import sys
from github import Github

github = Github(os.environ['GITHUB_OAUTH_USER'], os.environ['GITHUB_OAUTH_TOKEN'])
repo = github.get_repo('GuLinux/AstroPhoto-Plus')
release = repo.get_releases()[0]
for asset in release.get_assets():
    print('* {}'.format(asset.name))
    if 'Raspberry' in asset.name or 'Raspberry' in asset.label:
        print('Raspbian asset found in latest release {}: {}'.format(release.title, asset.name))
        sys.exit(0)
print('Raspbian asset NOT found')
sys.exit(1)

