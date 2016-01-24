from flask import Flask
import json

app = Flask(__name__)

@app.route('/')
def testPassword():
	answer = {}
	answer['password'] = 'pass123'
	answer['username'] = 'tlipoma'

	return json.dumps(answer)

if __name__ == '__main__':
	app.debug = False
	app.run('0.0.0.0')