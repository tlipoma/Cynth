from flask import Flask, request
import json
import os
from pymongo import MongoClient
import logging
app = Flask(__name__)

# TODO: add user sessions and login?
# TODO: add twofactor...

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Open mongodb connection
try:
	MLAB_URI = os.environ['CYNTH_MLAB_URI']
except:
	logger.error('Could not find mongodb uri')
try:
	client = MongoClient(MLAB_URI)
except:
	logger.error('Could not open mlab db')


@app.route('/store', methods=['POST', 'GET'])
def storePassword():
	desiredFileName = request.json['file']
	encryptedData = request.json['data']
	# Save file to disk
	file = open("store/"+desiredFileName+".cynth", "w")
	file.write(encryptedData)
	file.close()
	return "completed"

@app.route('/getPassword/<filename>')
def getPassword(filename):
	desiredFileName = "store/"+filename+".cynth"
	# Save file to disk
	file = open(desiredFileName, "r")
	eData = file.readline()
	file.close()
	data = {}
	data['file'] = desiredFileName
	data['encryptedData'] = eData
	return json.dumps(data)

@app.route('/')
def testPassword():
	answer = {}
	answer['password'] = 'pass123'
	answer['username'] = 'tlipoma'

	return json.dumps(answer)

if __name__ == '__main__':
	app.debug = False
	app.run('0.0.0.0')