var actionsByMsgs = {
	unfollowAll: {
		url: 'https://www.linkedin.com/feed/following/',
		fn: 'unfollow',
		arg: null,
	},
	unfollowConnections: {
		url: 'https://www.linkedin.com/feed/following/',
		fn: 'unfollow',
		arg: 'filter_connections',
	},
	unfollowOutOfNetwork: {
		url: 'https://www.linkedin.com/feed/following/',
		fn: 'unfollow',
		arg: 'filter_out_of_network',
	},
	unfollowCompanies: {
		url: 'https://www.linkedin.com/feed/following/',
		fn: 'unfollow',
		arg: 'filter_companies',
	},
	unfollowFollowers: {
		url: 'https://www.linkedin.com/feed/followers/',
		fn: 'unfollow',
		arg: null,
	},
	unfollowNetworkManager: {
		url: 'https://www.linkedin.com/mynetwork/network-manager/people-follow/following/',
		fn: 'unfollowNetworkManager',
		arg: null,
	},
	ignoreInvitations: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=',
		fn: 'ignoreInvitations',
		arg: null,
	},
	ignoreInvitationsWithCommonCompany: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=COMMON_COMPANY',
		fn: 'ignoreInvitations',
		arg: null,
	},
	ignoreInvitationsWithCommonEducation: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=COMMON_EDUCATION',
		fn: 'ignoreInvitations',
		arg: null,
	},
	ignoreInvitationsWithCommonConnection: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/?filterCriteria=COMMON_CONNECTION',
		fn: 'ignoreInvitations',
		arg: null,
	},
	withdrawSentInvitations: {
		url: 'https://www.linkedin.com/mynetwork/invitation-manager/sent/',
		fn: 'withdraw',
		arg: null,
	},
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (sender.id !== chrome.runtime.id)
		return;

	var action = actionsByMsgs[request.msg];
	if (!action)
		return console.log('Unexpected request message: "' + request.msg + '"');

	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		function injectScript(targetTab) {
			chrome.scripting.executeScript(
				{
					target: {tabId: targetTab.id},
					files: ['unfollow.js']
				},
				function(executedScriptResults) {
					chrome.scripting.executeScript({
						target: {tabId: targetTab.id},
						func: function(fnName, arg) {
							// Calls the matching function (unfollow/ignoreInvitations/withdraw)
							// that was just injected via unfollow.js, in the page's isolated world.
							if (typeof window[fnName] === 'function') {
								window[fnName](arg);
							} else {
								console.error('LinkedIn Unfollower: function "' + fnName + '" not found after injecting unfollow.js');
							}
						},
						args: [action.fn, action.arg]
					});
				}
			);
		}
		if (tabs[0].url && tabs[0].url.indexOf(action.url) === 0) {
			injectScript(tabs[0]);
			return;
		}
		chrome.tabs.update(tabs[0].id, {url: action.url}, function(updatedTab) {
			if (updatedTab.status === 'complete')
				injectScript(updatedTab);
			else
				chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo, tab) {
					if (updatedTabId === updatedTab.id && changeInfo.status === 'complete') {
						chrome.tabs.onUpdated.removeListener(listener);
						injectScript(updatedTab);
					}
				});
		});
	});
});