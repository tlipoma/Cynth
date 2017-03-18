const SERVER_ADDRESS = 'http://cynth.thomaslipoma.com/'

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
	let url = SERVER_ADDRESS + 'store?fileloc=' + encodeURIComponent(uri) + '&data=' + encodeURIComponent(encryptedData);
	console.log(url)
	let req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.send()

	// TODO: add reporting back on success/failure of request	
}

