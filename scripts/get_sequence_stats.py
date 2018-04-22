#!/usr/bin/python
import sys
import json


filename = sys.argv[1]

stats = []

with open(filename, 'r') as json_file:
        sequence = json.load(json_file)
        for item in sequence['sequenceItems']:
            if item['type'] == 'shots' and item['status'] == 'finished':
                stats.append({
                    'elapsed': item['elapsed'],
                    'each_elapsed': item['elapsed'] / item['count'],
                    'delta': item['elapsed'] - (item['exposure'] * item['count']),
                    'each_delta': item['elapsed'] / item['count'] - item['exposure'],
                })

print(json.dumps(stats, indent=4))

