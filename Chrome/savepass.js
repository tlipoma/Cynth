function getIdFromUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    // parse url
    url = url.split(".")[1];
    // return
    callback(url);
  });
}

function renderUsername(statusText) {
  document.getElementById('username').value = statusText;
}
function renderURL(urlText){
  document.getElementById('url').value = urlText;
}
function renderPassword(passText){
  document.getElementById('password').value = passText;
}
function renderUrlUsername(username){
  document.getElementById('urlusername').value = passText;
}
function renderMasterPass(masterText){
  document.getElementById('master_pass').value = masterText;
}
function renderCynthPass(cynthPass){
  document.getElementById('cynth_password').value = cynthPass;
}


function getDataFromServer(file, callback, errorCallback){
  var serverIP = '104.236.10.146:5000/';
  var url = 'http://' + serverIP + 'getPassword/' + file.toString();
  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.responseType = 'json';
  req.onload = function(){
    var response = req.response;
    callback(response.encryptedData);
  };
  req.onerror = function() {
    var status = req.statusText;
    errorCallback('Network error:' + status);
  };
  req.send();
}

function saveDataToServer(fileName, encryptedData){
  var serverIP = '104.236.10.146:5000/';
  var url = 'http://' + serverIP + 'store';
  var req = new XMLHttpRequest();
  req.open("POST", url);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var jsonData = {"file":fileName.toString(), "data":encryptedData.toString()}
  req.send(JSON.stringify(jsonData));
}

function hashFileName(user, url, pass){
  var tempHash = CryptoJS.SHA256(user+pass);
  return CryptoJS.SHA256(tempHash+url);
}

function encryptPassword(pass, MasterPass){
  return CryptoJS.AES.encrypt(pass, MasterPass);
}

function encryptData(masterPass, username, password){
  var jsonDataString = JSON.stringify({"username":username, "password":password});
  var encryptedMessage = CryptoJS.AES.encrypt(jsonDataString, masterPass);
  return encryptedMessage;

}

function decryptJsonPackage(message, MasterPass){
  var jsonString = CryptoJS.AES.decrypt(message, MasterPass).toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}

function decryptPassword(message, MasterPass){
  return CryptoJS.AES.decrypt(message, MasterPass);
}

function savePasswordOnClick(){
  var username = document.getElementById('username').value;
  var url = document.getElementById('url').value;
  var masterPass = document.getElementById('master_pass').value;
  var cynthPass = document.getElementById('cynth_password').value;
  var password = document.getElementById('password').value;
  var urlusername = document.getElementById('urlusername').value;

  var fileName = hashFileName(username, url, cynthPass);
  var encyptedData = encryptData(masterPass, urlusername, password);
  saveDataToServer(fileName, encyptedData);
}

function getTrueRandomNumber(time){
  // TODO: move this over to nist-beacon number
  return Math.floor((Math.random() * 50000000) +1);
}

function buildPassword(simple, kosher, keyLen){
  var finalHash = CryptoJS.PBKDF2(""+kosher, simple, {keySize: 512/32, iterations: 500});
  var utfHash = finalHash.toString();
  var charDictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#*()+={}/?'-_";
  var builtPass = "";
  for (i=0; i<keyLen; i++){
    // Build large random number based off of random number
    var dicIndex = 0;
    for (j=0; j<10; j++){
      dicIndex += parseInt(utfHash[Math.floor((Math.random() * utfHash.length))], 16);
    }
    builtPass += charDictionary[dicIndex % charDictionary.length];
  }
  return builtPass;

}

function generatePass(){
  var timeOffset = Math.floor((Math.random() * 432000) + 1);
  var epocTime = Math.floor(Date.now()/1000);

  var kosherSalt = getTrueRandomNumber(epocTime - timeOffset);
  var simpleSalt = CryptoJS.lib.WordArray.random(128/8);
  var keyLen = 8 + Math.floor((Math.random() * 6) + 1);

  var generatedPass = buildPassword(simpleSalt, kosherSalt, keyLen);

  renderPassword(generatedPass);

}

document.addEventListener('DOMContentLoaded', function() {
  // Preset Fields to make my life easier... for now
  // But seriously, get rid of this code asap
  renderUsername('tlipoma')
  // Preset URL
  getIdFromUrl(function(url){
    renderURL(url);
  });
  document.getElementById('savePassword').addEventListener('click', savePasswordOnClick);
  document.getElementById('genPassword').addEventListener('click', generatePass);
});