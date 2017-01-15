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

function getPasswordOnClick(){
  const username = document.getElementById('username').value;
  const url = document.getElementById('url').value;
  const masterPass = document.getElementById('master_pass').value;
  const cynthPass = document.getElementById('cynth_password').value;
  const password = document.getElementById('password').value;

  const uri = hashFileName(username, url, cynthPass);
  getPasswordFromServer(uri, function(eData){
    const jsonData = decryptJsonPackage(eData, masterPass);
    renderPassword(jsonData.password);
    renterUsername(jsonData.username);
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
  document.getElementById('getPassword').addEventListener('click', getPasswordOnClick);
});