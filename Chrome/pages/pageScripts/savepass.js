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

function savePasswordOnClick(){
  // Get login credentials
  const username = chrome.extension.getBackgroundPage().cynthUsername;
  const cynthPass = chrome.extension.getBackgroundPage().cynthPassword;
  const url = document.getElementById('url').value;
  const masterPass = document.getElementById('master_pass').value;
  const password = document.getElementById('password').value;
  const urlusername = document.getElementById('urlusername').value;

  const uri = hashFileName(username, url, cynthPass);
  const encyptedData = encryptData(masterPass, urlusername, password);
  saveDataToServer(uri, encyptedData);
}

function genPassClick() {
  renderPassword(generateRandomPass());
}

document.addEventListener('DOMContentLoaded', function() {
  // Preset Fields to make my life easier... for now
  // But seriously, get rid of this code asap
  // TODO: preset cynth user/pass
  // Preset URL
  getIdFromUrl(function(url){
    renderURL(url);
  });
  document.getElementById('savePassword').addEventListener('click', savePasswordOnClick);
  document.getElementById('genPassword').addEventListener('click', genPassClick);
});