/* LISTNER */
chrome.extension.onMessage.addListener(function(request,sender,sendResponse) {
	if(request.msg === "UnfollowPeople") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			var ProcessingTab = tabs[0].id;
			/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
				if(tabId == ProcessingTab && changeInfo.url) {
					chrome.tabs.executeScript(ProcessingTab, {
						file: "unfollow.js"
					});
				}
			});*/
			chrome.tabs.update(ProcessingTab, {url: "https://www.linkedin.com/feed/following/"});
			setTimeout(function(){
				chrome.tabs.executeScript(ProcessingTab, {
					file: "unfollow.js"
				});
			}, 7500);
		});
	}
	if(request.msg === "UnfollowFollowers") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			var ProcessingTab = tabs[0].id;
			/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
				if(tabId == ProcessingTab && changeInfo.url) {
					chrome.tabs.executeScript(ProcessingTab, {
						file: "unfollow.js"
					});
				}
			});*/
			chrome.tabs.update(ProcessingTab, {url: "https://www.linkedin.com/feed/followers/"});
			setTimeout(function(){
				chrome.tabs.executeScript(ProcessingTab, {
					file: "unfollow.js"
				});
			}, 7500);
		});
	}
});