from flask import Flask, request
import json
app = Flask(__name__)

# TODO: add user sessions and login?
# TODO: add twofactor...

@app.route('/store', methods=['POST', 'GET'])
def storePassword():
	print request.form
	desiredFileName = request.form['file']
	encryptedData = request.form['data']
	print encryptedData
	return

@app.route('/')
def testPassword():
	answer = {}
	answer['password'] = 'pass123'
	answer['username'] = 'tlipoma'

	return json.dumps(answer)

if __name__ == '__main__':
	app.debug = False
	app.run('0.0.0.0')