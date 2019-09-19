import json
with open('stars.json') as f:
    stars = json.load(f)

stars_mag7, stars_mag9, stars_over_mag9 = {}, {}, {}
for key, star in stars.items():
    if star['mag'] <= 7:
        stars_mag7[key] = star
    elif star['mag'] <= 9:
        stars_mag9[key] = star
    else:
        stars_over_mag9[key] = star

with open('stars_mag7.json', 'w') as f:
    json.dump(stars_mag7, f)
with open('stars_mag9.json', 'w') as f:
    json.dump(stars_mag9, f)
with open('stars_over_mag9.json', 'w') as f:
    json.dump(stars_over_mag9, f)
