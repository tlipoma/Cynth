// Global Varables for popup
var cynthUsername = null;
var cynthPassword = null;
var loggedIn = false;


// When the extension is installed or upgraded ...
chrome.runtime.onStartup.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            //pageUrl: { urlContains: 'e' },
            css: ["input[type='text']"]
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
