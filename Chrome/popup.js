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


function getPasswordFromServer(currentUrl, callback, errorCallback){
  var serverIP = '104.236.10.146:5000/';
  var url = 'http://' + serverIP;
  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.responseType = 'json';
  req.onload = function(){
    var response = req.response;
    callback("user:"+response.username + "  password:"+response.username);
  };
  req.onerror = function() {
    var status = req.statusText;
    errorCallback('Network error:' + status);
  };
  req.send();
}

function hashFileName(user, url, pass){
  var tempHash = CryptoJS.SHA256(user+pass);
  return CryptoJS.SHA256(tempHash+url);
}

function encryptPassword(pass, MasterPass){
  return CryptoJS.AES.encrypt(pass, MasterPass);
}

function decryptPassword(message, MasterPass){
  return CryptoJS.AES.decrypt(message, MasterPass);
}

function submitOnClick(){
  var username = document.getElementById('username').value;
  var url = document.getElementById('url').value;
  var masterPass = document.getElementById('master_pass');
  var cynthPass = document.getElementById('cynth_password').value;

  var fileName = hashFileName(username, url, cynthPass);
  var 
  renderPassword(hashFileName(username, url, cynthPass));
}

document.addEventListener('DOMContentLoaded', function() {
  // Preset Fields to make my life easier... for now
  // But seriously, get rid of this code asap
  renderUsername('tlipoma')
  // Preset URL
  getIdFromUrl(function(url){
    renderURL(url);
  });
  document.getElementById('send').addEventListener('click', submitOnClick);
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