#!/usr/bin/env python3
import os
import re


project_dir = (os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
css_file_path = os.path.join(project_dir, 'public', 'themes', 'bootswatch-v3', 'semantic.slate.min.css')

gfont_re = re.compile('@import url\(https:\/\/fonts\.googleapis\.com.*$')
with open(css_file_path, 'r') as f:
    lines = [line for line in f.readlines() if not gfont_re.match(line)]

with open(css_file_path, 'w') as f:
    f.write('\n'.join(lines))



