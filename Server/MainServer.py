from flask import Flask, request
import json
import os
from pymongo import MongoClient
import logging
app = Flask(__name__)

# TODO: add user sessions and login?
# TODO: add twofactor...

# Setup logger
logging.basicConfig(filename='cynth_log.txt', level=logging.INFO)
logger = logging.getLogger(__name__)
wlog = logging.getLogger('werkzeug')
wlog.setLevel(logging.ERROR)

# Open mongodb connection
logger.info('Initilizing DB connection')
try:
	MLAB_URI = os.environ['CYNTH_MLAB_URI']
	logger.info('Retrieved mlab URI')
except:
	logger.error('Could not find mongodb uri')
try:
	client = MongoClient(MLAB_URI)
	password_db = client.get_default_database()['passwords']
	logger.info('Opened password db')
except:
	logger.error('Could not open mlab db')

def get_from_mlab(filename):
	try:
		return password_db.find_one({'uri':filename})
	except Exception as e:
		logger.exception('error getting from mlab')
		return None

def save_to_mlab(filename, data):
	try:
		password_db.update({'uri':filename}, 
			{'uri':filename, 'data':data},
			upsert=True)
		return True
	except Exception as e:
		logger.exception('Error saving data for ' + filename)
		return False

@app.route('/store', methods=['POST', 'GET'])
def storePassword():
	try:
		logger.info('Storing passwords for ' + request.remote_addr)
		desiredFileName = request.json['file']
		encryptedData = request.json['data']
		# Save file to disk
		if save_to_mlab(desiredFileName, encryptedData):
			return "completed"
		logger.error('Could not store to database')
		return "error saving to db"
	except:
		return "error parsing request"

@app.route('/getPassword/<filename>')
def getPassword(filename):
	logger.info('Getting password data for ' + request.remote_addr)
	desiredFileName = filename
	# get data from mongo
	password_data = get_from_mlab(filename)
	data = {}
	data['file'] = desiredFileName
	if password_data:
		data['encryptedData'] = password_data['data']
	else:
		data['encryptedData'] = 'no password'
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