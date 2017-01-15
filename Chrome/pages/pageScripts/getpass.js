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

function renderURL(urlText){
  document.getElementById('url').value = urlText;
}
function renderPassword(passText){
  document.getElementById('password').value = passText;
}
function renderMasterPass(masterText){
  document.getElementById('master_pass').value = masterText;
}

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function getPasswordOnClick(){
  // Get login credentials
  const username = chrome.extension.getBackgroundPage().cynthUsername;
  const cynthPass = chrome.extension.getBackgroundPage().cynthPassword;
  // Get url and master pass
  const url = document.getElementById('url').value;
  const masterPass = document.getElementById('master_pass').value;

  const uri = hashFileName(username, url, cynthPass);
  getPasswordFromServer(uri, function(eData){
    const jsonData = decryptJsonPackage(eData, masterPass);
    renderPassword(jsonData.password);
    copyToClipboard(jsonData.password);
  },function(error){
    renderPassword(error);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Preset URL
  getIdFromUrl(function(url){
    renderURL(url);
  });
  // Set onclick listeners
  //document.getElementById('getPassForm').addEventListener('submit', getPasswordOnClick);
  document.getElementById('getPassword').addEventListener('click', getPasswordOnClick);
});