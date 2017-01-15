const SERVER_ADDRESS = 'http://127.0.0.1:5000/'

function getPasswordFromServer(file, callback, errorCallback) {
	let url = SERVER_ADDRESS + 'getPassword/' + file.toString();
	let req = new XMLHttpRequest();
	req.open('GET', url);
	req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	req.responseType = 'json';
	req.onload = function() {
		let response = req.response;
		callback(response.encryptedData);
	};
	req.onerror = function() {
		let status = req.statusText;
		errorCallback('Network error: ' + status)
	};
	req.send();
}

function saveDataToServer(uri, encryptedData) {
	let url = SERVER_ADDRESS + 'store';
	let req = new XMLHttpRequest();
	req.open('POST', url);
	req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	let jsonData = {'file':uri.toString(), 'data':encryptedData.toString()}
	req.send(JSON.stringify(jsonData));

	// TODO: add reporting back on success/failure of request	
}

