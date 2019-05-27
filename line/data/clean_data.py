import json

filename = "nyc_2015_09_25.json"
datastore = {}
if filename:
    with open(filename, 'r') as f:
        datastore = json.load(f)

#Use the new datastore datastructure
#print(datastore)
for line in datastore:
    line["start"] = [float(line['pickup_latitude']),float(line['pickup_longitude'])]
    line["end"] = [float(line['dropoff_latitude']),float(line['dropoff_longitude'])]
    #print(line['start'], line['end'])

#datastore = json.dumps(datastore)
with open('result.json', 'w') as f:
    json.dump(datastore, f)