from flask import Flask, request
import json
app = Flask(__name__)

# TODO: add user sessions and login?
# TODO: add twofactor...

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
	print desiredFileName
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