document.querySelector("[name=\"UnfollowPeople\"]").onclick = function() {
	chrome.extension.sendMessage({msg: "UnfollowPeople"});
	window.close();
};
document.querySelector("[name=\"UnfollowFollowers\"]").onclick = function() {
	chrome.extension.sendMessage({msg: "UnfollowFollowers"});
	window.close();
};
document.querySelector("[name=\"Close\"]").onclick = function() {
	window.close();
};