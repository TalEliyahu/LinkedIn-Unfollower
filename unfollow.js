var config = {
	smoothUnfollow: false,
	withdrawMinimalPause: 0, //milliseconds for asynchronous, or false for synchronous
	imitate: false,
};

(function() {
	function StatusBar(initialMessage) {
		var statusBar = this;

		var rootDiv = document.createElement('div');
		rootDiv.style = "position: fixed; bottom: 20px; right: 20px; z-index: 9999999999; background: #f6f7f9; border: 1px solid #ced0d4; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-family: 'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, 'sans-serif'; font-size: 13px; color: #4b4f56; padding: 10px 12px; display: flex; align-items: center; gap: 10px;";
		rootDiv.innerHTML = '<span name="Message">' + initialMessage + '</span>'
			+ '<button name="Stop" style="background-color: #005E93; color: aliceblue; border: none; border-radius: 4px; padding: 6px 12px; font-size: 13px; cursor: pointer;">Stop</button>'
			+ '<button name="Dismiss" style="background: none; border: none; color: #4b4f56; cursor: pointer; font-size: 16px; line-height: 1; padding: 0;">&times;</button>';
		var messageEl = rootDiv.querySelector('[name=Message]');
		var stopButton = rootDiv.querySelector('[name=Stop]');
		var dismissButton = rootDiv.querySelector('[name=Dismiss]');

		statusBar.onAbort = function() {};
		stopButton.addEventListener('click', function(e) {
			statusBar.onAbort();
			statusBar.finished();
		});
		dismissButton.addEventListener('click', function(e) {document.body.removeChild(rootDiv);});

		statusBar.setProgressMessage = function(messageText) {messageEl.innerText = messageText;};
		statusBar.finished = function() {stopButton.style.display = 'none';};
		statusBar.show = function() {document.body.appendChild(rootDiv);};
	}
	
	
	function retryWhileFails(failableAction, interval) {
		interval = interval || 100;
		return (function tryDoNow() {
			var actionResult = failableAction();
			if (actionResult !== undefined)
				return setTimeout(tryDoNow, actionResult !== false ? actionResult : interval);
		})();
	}
	
	function isVisible(element) {return !!element && !!element.offsetParent;}
	
	function doWhenLoaded(action) {
		function doActionAfterLoadAnimation() {
			var linkedinLoadingAnimation = document.querySelector('.initial-load-animation');
			retryWhileFails(function() {
				if (isVisible(linkedinLoadingAnimation))
					return false;
				action();
			});
		}
		
		if (document.readyState === 'complete')
			doActionAfterLoadAnimation();
		else
			document.addEventListener('load', function(e) {doActionAfterLoadAnimation();});
	}
	
	
	window.unfollow = function(filterButtonControlName) {
		doWhenLoaded(function doUnfollow() {
			function getFollowUnfollowButtons() {return document.querySelectorAll('.follows-recommendation-card__follow-btn[data-control-name="actor_follow_toggle"]');}
			
			if (filterButtonControlName) {
				retryWhileFails(function() {
					var filterListButton = document.querySelector('[data-control-name="filter_following_list"]');
					if (!filterListButton)
						return false;
					filterListButton.click();
					retryWhileFails(function() {
						var specificFilterButton = document.querySelector('[data-control-name="' + filterButtonControlName + '"]');
						if (!specificFilterButton)
							return false;
						var buttons = getFollowUnfollowButtons();
						specificFilterButton.click();
						retryWhileFails(function() {
							if (Array.prototype.some.call(buttons, isVisible))
								return false;
							unfollow(null);
						});
					});
				});
				return;
			}
			

			var ourForm = new StatusBar('Unfollowing everybody on this page...');
			if (!config.smoothUnfollow) {
				var totalItemsCount;
				var processedItemsCount;
				function updateProgressMessage() {ourForm.setProgressMessage(processedItemsCount + ' were unfollowed so far...');}
				var loopingId;
				var wait;
				var limit;
				
				chrome.storage.sync.get(['wait'], function(result){
					wait = parseInt(result.wait);
				});
				
				chrome.storage.sync.get(['limit'], function(result){
					limit = parseInt(result.limit);
				});
				
				ourForm.onStart = function() {
					totalItemsCount = 0;
					processedItemsCount = 0;
					updateProgressMessage();
					
					var waitingEndTime = -Infinity;
					loopingId = retryWhileFails(function() {
						var buttons = getFollowUnfollowButtons();
						var time = Date.now();
						if (totalItemsCount < buttons.length) {
							totalItemsCount = buttons.length;
							//updateProgressMessage();
							waitingEndTime = time + 5000;
							buttons.forEach(function(button, index) {
								setTimeout(function(){
									if(limit != '' && limit == processedItemsCount){
										clearTimeout(loopingId);
										ourForm.setProgressMessage('Finished after unfollowing ' + processedItemsCount + ' items.');
										ourForm.finished();
									}else{
										if (!button.classList.contains('is-following'))
											return;
										
										if (!config.imitate){
											button.click();
										}
										else {button.classList.remove('is-following'); button.innerHTML = '';}
										
										++processedItemsCount;
									updateProgressMessage();
									}
								}, wait * index);
							});
							document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
							return false;
						}
						if (document.querySelector('.loader')) {
							waitingEndTime = -Infinity;
							return false;
						}
						if (time <= waitingEndTime)
							return false;
						ourForm.setProgressMessage('Finished after unfollowing ' + processedItemsCount + ' items.');
						ourForm.finished();
					});
				};
				ourForm.onAbort = function() {
					if (loopingId)
						clearTimeout(loopingId);
					ourForm.setProgressMessage('Cancelled after unfollowing ' + processedItemsCount + ' items!');
				
				};
			}
			else {
				var processedItemsCount;
				function updateProgressMessage() {ourForm.setProgressMessage(processedItemsCount + ' were unfollowed so far...');}
				var currentHeight;
				var unfollowingId;
				var scrollingId;
				var endCheckingId;
				
				ourForm.onStart = function() {
					processedItemsCount = 0;
					updateProgressMessage();

					currentHeight = document.body.scrollHeight;
					unfollowingId = setInterval(function() {
						var buttons = getFollowUnfollowButtons();
						for(var b = buttons.length - 1; b >= 0; --b) {
							if (!buttons[b].classList.contains('is-following'))
								continue;
							
							if (!config.imitate) buttons[b].click();
							else {buttons[b].classList.remove('is-following'); buttons[b].innerHTML = '';}
							
							++processedItemsCount;
							updateProgressMessage();
						}
					}, 1000);
					scrollingId = setInterval(function() {scrollBy(0, 12.5);}, 15);
					endCheckingId = setInterval(function() {
						if (document.body.scrollHeight <= currentHeight) {
							clearInterval(endCheckingId);
							clearInterval(scrollingId);
							clearInterval(unfollowingId);
							ourForm.setProgressMessage('Finished after unfollowing ' + processedItemsCount + ' items.');
							ourForm.finished();
							return;
						}
						currentHeight = document.body.scrollHeight;
					}, 7.5 * 1000);
				};
				ourForm.onAbort = function() {
					clearInterval(endCheckingId);
					clearInterval(scrollingId);
					clearInterval(unfollowingId);
					ourForm.setProgressMessage('Cancelled after unfollowing ' + processedItemsCount + ' items!');
				};
			}
			ourForm.show();
			ourForm.onStart();
		});
	};

	window.unfollowNetworkManager = function() {
		doWhenLoaded(function doUnfollow() {
			if (document.getElementById('LiUnfollowBar'))
				return;

			function getFollowingButtons() {return document.querySelectorAll('button[aria-label^="Click to stop following"]');}

			var bar = document.createElement('div');
			bar.id = 'LiUnfollowBar';
			bar.style = "position: fixed; bottom: 20px; right: 20px; z-index: 9999999999; background: #f6f7f9; border: 1px solid #ced0d4; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-family: 'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, 'sans-serif'; font-size: 13px; color: #4b4f56; padding: 10px 12px; display: flex; align-items: center; gap: 10px;";
			bar.innerHTML = '<span name="Message">Unfollow everyone on this page?</span>'
				+ '<button name="Toggle" style="background-color: #005E93; color: aliceblue; border: none; border-radius: 4px; padding: 6px 12px; font-size: 13px; cursor: pointer;">Start</button>'
				+ '<button name="Dismiss" style="background: none; border: none; color: #4b4f56; cursor: pointer; font-size: 16px; line-height: 1; padding: 0;">&times;</button>';
			document.body.appendChild(bar);

			var messageEl = bar.querySelector('[name=Message]');
			var toggleButton = bar.querySelector('[name=Toggle]');
			var dismissButton = bar.querySelector('[name=Dismiss]');

			var running = false;
			var processedItemsCount = 0;
			var loopingId;
			var emptyScrollCount;

			function stop(finalMessage) {
				running = false;
				if (loopingId)
					clearTimeout(loopingId);
				toggleButton.innerText = 'Start';
				messageEl.innerText = finalMessage;
			}

			function start() {
				running = true;
				processedItemsCount = 0;
				emptyScrollCount = 0;
				toggleButton.innerText = 'Stop';
				messageEl.innerText = processedItemsCount + ' unfollowed so far...';
				loopingId = retryWhileFails(function() {
					if (!running)
						return;
					var confirmButton = document.querySelector('button[data-test-dialog-primary-btn]');
					if (confirmButton) {
						confirmButton.click();
						++processedItemsCount;
						emptyScrollCount = 0;
						messageEl.innerText = processedItemsCount + ' unfollowed so far...';
						return 1500;
					}
					var buttons = getFollowingButtons();
					if (buttons.length) {
						buttons[0].click();
						return 500;
					}
					if (emptyScrollCount >= 4) {
						stop('Finished, unfollowed ' + processedItemsCount + '.');
						return;
					}
					++emptyScrollCount;
					document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
					return 1000;
				});
			}

			toggleButton.addEventListener('click', function() {
				if (running)
					stop('Stopped after unfollowing ' + processedItemsCount + '.');
				else
					start();
			});
			dismissButton.addEventListener('click', function() {
				if (loopingId)
					clearTimeout(loopingId);
				document.body.removeChild(bar);
			});
		});
	};

	window.ignoreInvitations = function() {
		doWhenLoaded(function() {
			var ourForm = new StatusBar('Ignoring every invitation on this page...');
			{
				var processedItems;
				var loopingId;
				ourForm.onStart = function() {
					processedItems = new Set();
					loopingId = retryWhileFails(function() {
						var button = document.querySelector('.invitation-card__action-btn[data-control-name="decline"]');
						if (button) {
							if (!processedItems.has(button)) {
								if (!config.imitate) button.click();
								else {var li = button.closest('.invitation-card__action-btn'); li.parentNode.removeChild(li);}
								processedItems.add(button);
								ourForm.setProgressMessage('Ignored ' + processedItems.size + ' invitations so far...');
							}
							return false;
						}
						ourForm.setProgressMessage('Finished after ignoring ' + processedItems.size + ' invitations.');
						ourForm.finished();
					});
				};
				ourForm.onAbort = function() {
					if (loopingId)
						clearTimeout(loopingId);
					ourForm.setProgressMessage('Cancelled after ignoring ' + processedItems.size + ' invitations!');
				};
			}
			ourForm.show();
			ourForm.onStart();
		});
	};

	window.withdraw = function() {
		doWhenLoaded(function() {
			var ourForm = new StatusBar('Withdrawing every invitation on this page...');
			if (config.withdrawMinimalPause !== false) {
				var processedItems;
				var loopingId;
				ourForm.onStart = function() {
					processedItems = new Set();
					loopingId = retryWhileFails(function() {
						var button = document.querySelector('.invitation-card__action-btn[data-control-name="withdraw_single"]');
						if (button) {
							if (!processedItems.has(button)) {
								if (!config.imitate) button.click();
								else {var li = button.closest('.invitation-card__action-btn'); li.parentNode.removeChild(li);}
								processedItems.add(button);
								ourForm.setProgressMessage('Withdrawed ' + processedItems.size + ' invitations so far...');
								return config.withdrawMinimalPause;
							}
							return false;
						}
						ourForm.setProgressMessage('Finished after withdrawing ' + processedItems.size + ' invitations.');
						ourForm.finished();
					});
				};
				ourForm.onAbort = function() {
					if (loopingId)
						clearTimeout(loopingId);
					ourForm.setProgressMessage('Cancelled after withdrawing ' + processedItems.size + ' invitations!');
				};
			}
			else {
				var processedItems;
				var loopingId;
				ourForm.onStart = function() {
					processedItems = new Set();
					loopingId = retryWhileFails(function() {
						var buttons = document.querySelectorAll('.invitation-card__action-btn[data-control-name="withdraw_single"]');
						if (buttons.length != 0) {
							buttons.forEach(function(button) {
								if (processedItems.has(button))
									return;
								button.click();
								processedItems.add(button);
								ourForm.setProgressMessage('Withdrawed ' + processedItems.size + ' invitations so far...');
							});
							return false;
						}
						ourForm.setProgressMessage('Finished after withdrawing ' + processedItems.size + ' invitations.');
						ourForm.finished();
					});
				};
				ourForm.onAbort = function() {
					if (loopingId)
						clearTimeout(loopingId);
					ourForm.setProgressMessage('Cancelled after withdrawing ' + processedItems.size + ' invitations!');
				};
			}
			ourForm.show();
			ourForm.onStart();
		});
	};
})();