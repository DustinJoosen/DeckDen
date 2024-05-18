import json

with open('data.json', 'r') as file:
    data = json.load(file)

for pokemon in data['pokemon']:
    pokemon['id'] = pokemon['dex']

with open('pokemon_data_with_id.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Successfully added 'id' field to each record.")
