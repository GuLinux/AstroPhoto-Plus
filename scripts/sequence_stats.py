### Get detailed sequence statistics from exported json files

import sys
import os
import json
import datetime

prefix = sys.argv[1]

def read_json(file):
    with open(file, 'r') as json_file:
        return json.load(json_file)

json_files = sorted([f for f in os.listdir('.') if f.startswith(prefix) and f.endswith('.json')])

data = [read_json(f) for f in json_files]
# {"exposure": 1, "number": 1, "time_started": 1532214166.9270122, "time_finished": 1532214168.8757792, "temperature_started": 30.0, "temperature_finished": 30.0, "temperature_average": 30.05}

count = len(data)
elapsed = data[-1]['time_finished'] - data[0]['time_started']
elapsed_each = elapsed / count
delta_total = elapsed - (data[0]['exposure'] * count)
delta_each = delta_total / count

temperatures = [item['temperature_average'] for item in data]
temp_min = min(temperatures)
temp_max = max(temperatures)

temp_average = sum(temperatures) / count

def ftime(secs):
    return str(datetime.timedelta(seconds=secs))

print('''
Total elapsed time: {}
Elapsed for each shot: {}
Total delta: {} ({:.2f}%)
Delta for each shot: {}
Temperatures: min={:.2f}, max={:.2f}, average: {:.2f}, max difference={:.2f}
'''.format(ftime(elapsed), ftime(elapsed_each), ftime(delta_total), 100. / elapsed * delta_total, ftime(delta_each), temp_min, temp_max, temp_average, temp_max - temp_min))


