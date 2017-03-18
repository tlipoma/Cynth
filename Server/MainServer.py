from flask import Flask, request
import json
import os
from pymongo import MongoClient
import logging
app = Flask(__name__)

# TODO: add user sessions and login?
# TODO: add twofactor...

# Setup logger
#logging.basicConfig(filename='cynth_log.txt', level=logging.INFO)
logging.basicConfig( level=logging.INFO)
logger = logging.getLogger(__name__)
wlog = logging.getLogger('werkzeug')
wlog.setLevel(logging.ERROR)
#wlog.setLevel(logging.DEBUG)

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
		logger.error('error getting from mlab')
		return None

def save_to_mlab(filename, data):
	try:
		password_db.update({'uri':filename}, 
			{'uri':filename, 'data':data},
			upsert=True)
		logger.debug('Save to mlab success')
		return True
	except Exception as e:
		logger.error('Error saving data for ' + filename)
		return False

@app.route('/store', methods=['GET'])
def storePassword():
	try:
		logger.info('Storing passwords for ' + request.remote_addr)
		logger.debug(request.json)
		desiredFileName = request.args.get('fileloc')
		encryptedData = request.args.get('data')		
		logger.debug("filename: " + desiredFileName)
		logger.debug("data: " + encryptedData)
		# Save file to disk
		if save_to_mlab(desiredFileName, encryptedData):
			return "completed"
		logger.error('Could not store to database')
		return "error saving to db"
	except:
		logger.error('Error parsing request to save')
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
	app.run(host='0.0.0.0', port="5000")
