var actionsByMsgs = {
	unfollowAll: {
		url: 'https://www.linkedin.com/feed/following/',
		code: 'unfollow(null);',
	},
	unfollowConnections: {
		url: 'https://www.linkedin.com/feed/following/',
		code: 'unfollow("filter_connections");',
	},
	unfollowOutOfNetwork: {
		url: 'https://www.linkedin.com/feed/following/',
		code: 'unfollow("filter_out_of_network");',
	},
	unfollowCompanies: {
		url: 'https://www.linkedin.com/feed/following/',
		code: 'unfollow("filter_companies");',
	},
	unfollowFollowers: {
		url: 'https://www.linkedin.com/feed/followers/',
		code: 'unfollow(null);',
	},
	ignoreInvitations: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=',
		code: 'ignoreInvitations();',
	},
	ignoreInvitationsWithCommonCompany: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=COMMON_COMPANY',
		code: 'ignoreInvitations();',
	},
	ignoreInvitationsWithCommonEducation: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=COMMON_EDUCATION',
		code: 'ignoreInvitations();',
	},
	ignoreInvitationsWithCommonConnection: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=COMMON_CONNECTION',
		code: 'ignoreInvitations();',
	},
	withdrawSentInvitations: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/sent/',
		code: 'withdraw();',
	},
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (sender.id !== chrome.runtime.id)
		return;

	var action = actionsByMsgs[request.msg];
	if (!action)
		return console.log('Unexpected request message: "' + request.msg + '"');
		
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.update(tabs[0].id, {url: action.url}, function(updatedTab) {
			function injectScript() {
				chrome.tabs.executeScript(
					updatedTab.id, 
					{file: 'unfollow.js'}, 
					function(executedScriptResults) {
						chrome.tabs.executeScript(updatedTab.id, {code: action.code});
					}
				);
			}
			if (updatedTab.status === 'complete')
				injectScript();
			else
				chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo, tab) {
					if (updatedTabId === updatedTab.id && changeInfo.status === 'complete') {
						chrome.tabs.onUpdated.removeListener(listener);
						injectScript();
					}
				});
		});
	});
});
