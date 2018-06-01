from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os
 
app = Flask(__name__)
 
MONGODB_URI = 'mongodb://heroku_1cxrtrp8:cd70hc9kcckhahnsgvelevsrj4@ds149132.mlab.com:49132/heroku_1cxrtrp8'
DBS_NAME = 'heroku_1cxrtrp8'
# MONGODB_URI = os.environ.get('MONGODB_URI')
# DBS_NAME = os.environ.get('MONGO_DB_NAME', 'endangeredspecies')
COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME', 'species')

@app.route("/")
def graph():
    return render_template("graphs.html")

@app.route("/endangeredSpecies/species")
def endangered_species():

    FIELDS = {
        '_id': False, 
        'IUCN Category': True,
        'IUCN': True,
        'Species': True,
        'Country': True, 
        'Value': True,
        'Indigenous': True
    }
 
    with MongoClient(MONGODB_URI) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        projects = collection.find(projection=FIELDS, limit=55000)
        return json.dumps(list(projects))
 
 
if __name__ == "__main__":
    app.run(debug=True)