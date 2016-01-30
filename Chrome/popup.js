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

function decryptPassword(message, MasterPass){
  return CryptoJS.AES.decrypt(message, MasterPass);
}

function savePasswordOnClick(){
  var username = document.getElementById('username').value;
  var url = document.getElementById('url').value;
  var masterPass = document.getElementById('master_pass').value;
  var cynthPass = document.getElementById('cynth_password').value;
  var password = document.getElementById('password').value;

  var fileName = hashFileName(username, url, cynthPass);
  var encyptedData = encryptData(masterPass, username, password);
  saveDataToServer(fileName, encyptedData);
}

function getPasswordOnClick(){
  var username = document.getElementById('username').value;
  var url = document.getElementById('url').value;
  var masterPass = document.getElementById('master_pass').value;
  var cynthPass = document.getElementById('cynth_password').value;
  var password = document.getElementById('password').value;

  var fileName = hashFileName(username, url, cynthPass);
  getDataFromServer(fileName, function(eData){
    renderPassword(eData);
  },function(error){
    renderPassword(error);
  });

}

document.addEventListener('DOMContentLoaded', function() {
  // Preset Fields to make my life easier... for now
  // But seriously, get rid of this code asap
  renderUsername('tlipoma')
  // Preset URL
  getIdFromUrl(function(url){
    renderURL(url);
  });
  document.getElementById('sendPassword').addEventListener('click', savePasswordOnClick);
  document.getElementById('getPassword').addEventListener('click', getPasswordOnClick);
  //var hash = CryptoJS.SHA256("Message");
  //renderUsername(hash);
  //getCurrentTabUrl(function(url){
    // Put the image URL in Google search.
    //renderUsername(url);

    // Call to the server for the password
    //getPasswordFromServer(url, function(resonse){
    //  renderStatus(resonse);
    //}, function(errorMessage){
    //  renderStatus(errorMessage);
    //});
  //});
});