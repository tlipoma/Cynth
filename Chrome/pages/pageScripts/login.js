
function goToGet(){
	window.location.href="getpass.html";
}

function login(){
	// Get values from form
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	// Save to global
	chrome.extension.getBackgroundPage().cynthUsername = username;
	chrome.extension.getBackgroundPage().cynthPassword = password;
	// Marked as logged in
	chrome.extension.getBackgroundPage().loggedIn = true;
	// Go To next page
	goToGet();
}

// Listen for login Button
document.addEventListener('DOMContentLoaded', function(){
	// Check for login
	if (chrome.extension.getBackgroundPage().loggedIn) {
		goToGet();
	};
	// Set onclick listeners
	document.getElementById('loginForm').addEventListener('submit', login);
});