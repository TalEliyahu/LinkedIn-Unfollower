var config = {
	smoothUnfollow: false,
	withdrawMinimalPause: 0, //milliseconds for asynchronous, or false for synchronous
	imitate: false,
};

(function() {
	function OurForm(confirmationText) {
		var ourForm = this;
		
		var rootDiv = document.createElement('div');
		rootDiv.id = 'LiUnfollow';
		rootDiv.style = "width: 300px; height: auto; background: #f6f7f9; z-index: 9999999999; position: fixed; top: calc(50% - 100px); right: calc(50% - 150px); border: 1px solid #ced0d4; border-radius: 2px; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; font-size: medium; font-weight: normal;";
		rootDiv.innerHTML = '<div style="color: aliceblue; background-color: #005E93; border-bottom: 1px solid #ced0d4; padding: 7.5px; text-align: center;">'
			+ '    LinkedIn Unfollower'
			+ '</div>'
			+ '<div name="Confirmation">'
			+ '    <div style="font-size: 14px; color: #4b4f56; margin: 7.5px; display: block; cursor: default;">' + confirmationText + '</div>'
			+ '    <div style="background-color: #005E93; border-top: 1px solid #ced0d4; padding: 7.5px;">'
			+ '        <button type="button" name="Start" '
			+ '        style="background-color: #f6f7f9; color: #4b4f56; border: 1px solid #ced0d4; padding: 0 8px; line-height: 27.5px; font-weight: normal; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; font-size: 14px;" '
			+ '        >Yes</button>'
			+ '        <button name="Close" '
			+ '        style="background-color: #f6f7f9; color: #4b4f56; border: 1px solid #ced0d4; padding: 0 8px; line-height: 27.5px; font-weight: normal; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; font-size: 14px; margin-left: 7.5px;" '
			+ '        >No</button>'
			+ '    </div>'
			+ '</div>'
			+ '<div name="Working" style="display: none;">'
			+ '    <div name="Message" style="font-size: 14px; color: #4b4f56; margin: 7.5px; cursor: default; display: block;"></div>'
			+ '    <div style="background-color: #005E93; border-top: 1px solid #ced0d4; padding: 7.5px;">'
			+ '        <button name="Close" '
			+ '        style="background-color: #f6f7f9; color: #4b4f56; border: 1px solid #ced0d4; padding: 0 8px; line-height: 27.5px; font-weight: normal; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; font-size: 14px;" '
			+ '        >Stop</button>'
			+ '    </div>'
			+ '</div>'
			+ '<div name="Finished" style="display: none;">'
			+ '    <div name="Message" style="font-size: 14px; color: #4b4f56; margin: 7.5px; cursor: default; display: block;"></div>'
			+ '    <div style="background-color: #005E93; border-top: 1px solid #ced0d4; padding: 7.5px;">'
			+ '        <button name="Close" '
			+ '        style="background-color: #f6f7f9; color: #4b4f56; border: 1px solid #ced0d4; padding: 0 8px; line-height: 27.5px; font-weight: normal; font-family: \'Gill Sans\', \'Gill Sans MT\', \'Myriad Pro\', \'DejaVu Sans Condensed\', Helvetica, Arial, \'sans-serif\'; font-size: 14px;" '
			+ '        >Close</button>'
			+ '    </div>'
			+ '</div>';
		var confirmationDiv = rootDiv.querySelector('[name=Confirmation]');
		var workingDiv = rootDiv.querySelector('[name=Working]');
		var finishedDiv = rootDiv.querySelector('[name=Finished]');

		ourForm.onStart = function() {};
		confirmationDiv.querySelector('[name=Start]').addEventListener('click', function(e) {
			confirmationDiv.style.display = 'none';
			workingDiv.style.display = 'block';
			ourForm.onStart();
		});
		confirmationDiv.querySelector('[name=Close]').addEventListener('click', function(e) {close();});
		
		ourForm.onAbort = function() {};
		workingDiv.querySelector('[name=Close]').addEventListener('click', function(e) {
			ourForm.onAbort();
			ourForm.finished();
		});
		
		finishedDiv.querySelector('[name=Close]').addEventListener('click', function(e) {close();});
		
		ourForm.setProgressMessage = function(messageText) {
			workingDiv.querySelector('[name=Message]').innerText = messageText;
		};

		ourForm.finished = function() {
			confirmationDiv.style.display = 'none';
			workingDiv.style.display = 'none';
			finishedDiv.querySelector('[name=Message]').innerText = workingDiv.querySelector('[name=Message]').innerText;
			finishedDiv.style.display = 'block';
		};

		ourForm.show = function() {document.body.appendChild(rootDiv);};
		function close() {document.body.removeChild(rootDiv);}
	}
	
	
	function retryWhileFails(failableAction, interval) {
		interval = interval || 100;
		return (function tryDoNow() {
			var actionResult = failableAction();
			if (actionResult !== undefined)
				return setTimeout(tryDoNow, actionResult !== false ? actionResult : interval);
		})();
	}
	
	function isVisible(element) {return !!element.offsetParent;}
	
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
			function getFollowUnfollowButtons() {return document.querySelectorAll('.feed-s-follow-recommendation-card [data-control-name="actor_follow_toggle"]');}
			
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
			

			var ourForm = new OurForm('Are You Sure You Want to Unfollow Everybody On This Page?');
			if (!config.smoothUnfollow) {
				var totalItemsCount;
				var processedItemsCount;
				function updateProgressMessage() {ourForm.setProgressMessage(processedItemsCount + ' were unfollowed so far...');}
				var loopingId;
				
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
							buttons.forEach(function(button) {
								if (!button.classList.contains('is-following'))
									return;
								
								if (!config.imitate) button.click();
								else {button.classList.remove('is-following'); button.innerHTML = '';}
								
								++processedItemsCount;
								updateProgressMessage();
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
		});
	};

	window.ignoreInvitations = function() {
		doWhenLoaded(function() {
			var ourForm = new OurForm('Are You Sure You Want to Ignore Every Invitation On This Page?');
			{
				var processedItems;
				var loopingId;
				ourForm.onStart = function() {
					processedItems = new Set();
					loopingId = retryWhileFails(function() {
						var button = document.querySelector('.mn-invitation-card [data-control-name="decline"]');
						if (button) {
							if (!processedItems.has(button)) {
								if (!config.imitate) button.click();
								else {var li = button.closest('.mn-invitation-card'); li.parentNode.removeChild(li);}
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
		});
	};

	window.withdraw = function() {
		doWhenLoaded(function() {
			var ourForm = new OurForm('Are You Sure You Want to Withdraw Every Invitation On This Page?');
			if (config.withdrawMinimalPause !== false) {
				var processedItems;
				var loopingId;
				ourForm.onStart = function() {
					processedItems = new Set();
					loopingId = retryWhileFails(function() {
						var button = document.querySelector('.mn-person-card [data-control-name="withdraw_single"]');
						if (button) {
							if (!processedItems.has(button)) {
								if (!config.imitate) button.click();
								else {var li = button.closest('.mn-person-card'); li.parentNode.removeChild(li);}
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
						var buttons = document.querySelectorAll('.mn-person-card [data-control-name="withdraw_single"]');
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
		});
	};
})();
