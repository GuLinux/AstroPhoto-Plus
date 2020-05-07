#!/usr/bin/env python3
import os
import re


project_dir = (os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
css_file_path = os.path.join(project_dir, 'node_modules/forest-themes/dist/semantic-ui/v2/semantic.flat.min.css')

#gfont_re = re.compile('@import url\(https:\/\/fonts\.googleapis\.com.*\);$')
gfont_re = re.compile('@import url\(https:\/\/fonts\.googleapis\.com.*\);')

def remove_gfonts(line):
    new_line = gfont_re.sub('', line)
    if new_line != line:
        print('*** fonts url removed:')
        print('<<<{}'.format(line))
        print('>>>{}'.format(new_line))
    return new_line

with open(css_file_path, 'r') as f:
    lines = [remove_gfonts(line) for line in f.readlines()]

with open(css_file_path, 'w') as f:
    for line in lines:
        f.write(line)



