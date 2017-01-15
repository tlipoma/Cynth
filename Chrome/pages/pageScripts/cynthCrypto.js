function hashFileName(user, url, pass) {
	const tempHash = CryptoJS.SHA256(user+pass);
	return CryptoJS.SHA256(tempHash+url);
}

function encryptPassword(pass, masterPass) {
	return CryptoJS.AES.encrypt(pass, masterPass);
}

function encryptData(masterPass, username, password) {
	const jsonDataString = JSON.stringify( {'username':username, 'password':password});
	return CryptoJS.AES.encrypt(jsonDataString, masterPass);
}

function decryptJsonPackage(message, masterPass) {
	const jsonString = CryptoJS.AES.decrypt(message, masterPass).toString(CryptoJS.enc.Utf8);
	return JSON.parse(jsonString);
}

function decryptPassword(message, masterPass) {
	return CryptoJS.AES.decrypt(message, masterPass);
}

function getTrueRandomNumber(time) {
	// TODO: move this over to nist-beacon number generator
	return Math.floor((Math.random() * 50000000) +1);
}

function buildPass(simple, kosher, keyLen) {
	const finalHash = CryptoJS.PBKDF2('' + kosher, simple, {keySize: 512/32, itterations: 500});
	const utfHash = finalHash.toString();
	const charDictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#*()+={}/?'-_";
	let builtPass = '';
	for (var i=0; i<keyLen; i++) {
		let dicIndex = 0;
		for (var j=0; j<10; j++) {
			dicIndex += parseInt(utfHash[Math.floor((Math.random() * utfHash.length))], 16);
		}
		builtPass += charDictionary[dicIndex % charDictionary.length];
	}
	return builtPass;
}

function generateRandomPass() {
	const timeOffset = Math.floor((Math.random() * 432000) + 1);
	const epocTime = Math.floor(Date.now()/1000);

	const kosherSalt = getTrueRandomNumber(epocTime - timeOffset);
	const simpleSalt = CryptoJS.lib.WordArray.random(128/8);
	const keyLen = 8 + Math.floor((Math.random() + 6) + 1);

	const generatedPass = buildPass(simpleSalt, kosherSalt, keyLen);

	return generatedPass;
}