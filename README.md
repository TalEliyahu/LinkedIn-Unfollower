You follow massive amounts of people and can't seem to get quality content from people you actually want to follow on? 
Now you bulk unfollow people or companies.

Options:

- Unfollow people, companies, out-of-Network connections that you are following.
- Unfollow people who are following you.
- Ignore Received Invitations.
- Withdraw Sent Invitations



1. If you are using chrome go the page that shows who you are following  https://www.linkedin.com/feed/following/
2. Press F12 to see the console.
3. Copy Paste this to console:

```TotalUnfollowed = 0;
var UnfollowFunction = setInterval(function() {
 var UnfollowButton = document.querySelectorAll("ul > li [data-control-name=\"actor_follow_toggle\"].is-following");
 for(var i = UnfollowButton.length - 1; i>=0; i--) {
  TotalUnfollowed++;
  UnfollowButton[i].click();
 }
}, 1000);
var ScrollToBottom = setInterval(function() {
 window.scrollBy(0, 12.5);
}, 15);
function CheckPageEnd(LastHeight) {
 var CurrentHeight = document.body.scrollHeight;
 if(!(CurrentHeight > LastHeight)) {
  clearInterval(ScrollToBottom);
  clearInterval(UnfollowFunction);
  alert("Total Unfollowed: " + TotalUnfollowed);
 } else setTimeout(function() {
  CheckPageEnd(CurrentHeight);
 }, 7.5*1000);
}
CheckPageEnd(0);
```
4. Press Enter. 

5. Follow Us On [![alt text][2.1]][2]

[2.1]: http://i.imgur.com/P3YfQoD.png 
[2]: http://www.facebook.com/SingaporeTechEntrepreneurs/

<a href="https://user-images.githubusercontent.com/31100945/29992087-17962570-8fc6-11e7-87b9-698561973c3e.gif" target="_blank"><img src="https://user-images.githubusercontent.com/31100945/29992087-17962570-8fc6-11e7-87b9-698561973c3e.gif" alt="56c6bd17-d834-480c-y917-4b719f91eb03" style="max-width:100%;"></a>


# Using the Chrome Extension to bulk unfollow people or companies on LinkedIn

You can also use the Chrome Extension to to bulk unfollow people or companies.
1. Open the extension popup by clicking on the extension icon.
2. Select an option "Unfollow People You are Following" or "Unfollow People Who are Following You"
3. Then it will open target option page and ask "Are You Sure You Want to Unfollow All Peoples?" Click on "Yes".
Now it will auto scroll and unfollow all people or companies and it will show you the progress. Click on "Stop" to stop unfollowing.


# Compiling and installing the extension

Modifying The Manifest File
The “manifest.json” file is containing all information of the extension. Modify this file to update the extension name, description and icon.

Compiling to Chrome Extension Package
To compile the source files, first switch to “Developer mode” from (chrome://extensions) the extension page of Chrome.

<img src="http://i.imgur.com/047g5iJ.png" style="max-width:100%;">

Now click on “Pack extension…” button the select the folder congaing the source files and pack the extension. The “Private key file” is not required.

<img src="http://i.imgur.com/P6V4SK3.png" style="max-width:100%;">

Installing:
Just drag and drop the packed extension (.crx) file to install it.

<img src="http://i.imgur.com/bYBaZb3.png" style="max-width:100%;">


# Codes of the extension

We used pure JavaScript to develop this extension. There is no JS library.
The popup.js file is using "chrome.extension.sendMessage" api to send message to the background.js file. The background file is opening target URL in the active tab and executing the unfollow.js file on that tab.

# unfollow.js

You can also copy paste the codes of unfollow.js to console to get the unfollow feature with nice UI.      

```
function isHidden(el) {
	if(el) return (el.offsetParent === null);
	else return false;
}

TotalUnfollowed = 0;

var LoadingAnimation = document.getElementsByClassName("initial-load-animation")[0];
var CatchLoadingAnimation = setInterval(function(){
	if(isHidden(LoadingAnimation) == true) {
		clearInterval(CatchLoadingAnimation);
		/* START: RUN AFTER PAGE LOAD COMPLETE */
		/* SHOW STATUS AND CONFIRMATION ELEMENT */
		var LiUnfollow = document.createElement("div");
			LiUnfollow.id = "LiUnfollow";
			LiUnfollow.innerHTML = "<div style=\"color: aliceblue; background-color: #005E93; border-bottom: 1px solid #ced0d4; padding: 7.5px; text-align: center;\">LinkedIn Unfollower</div><div name=\"Confirmation\"><div style=\"font-size: 14px; color: #4b4f56; margin: 7.5px; display: block; cursor: default;\">Are You Sure You Want to Unfollow All Peoples?</div><div style=\"background-color: #005E93; border-top: 1px solid #ced0d4; padding: 7.5px;\"><button type=\"button\" name=\"Continue\" style=\"background-color: #f6f7f9; color: #4b4f56; border: 1px solid #ced0d4; padding: 0 8px; line-height: 27.5px; font-weight: normal; font-family: 'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, 'sans-serif'; font-size: 14px;\">Yes</button><button type=\"button\" name=\"Close\" style=\"background-color: #f6f7f9; color: #4b4f56; border: 1px solid #ced0d4; padding: 0 8px; line-height: 27.5px; font-weight: normal; font-family: 'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, 'sans-serif'; font-size: 14px; margin-left: 7.5px;\">No</button></div></div><div name=\"Status\" style=\"display: none;\"><div style=\"font-size: 14px; color: #4b4f56; margin: 7.5px; display: block; cursor: default;\"><div name=\"Message\" style=\"display: none;\">Unfollowed Successfully!</div>Total Unfollowed: <span name=\"TotalUnfollowed\">0</span></div><div style=\"background-color: #005E93; border-top: 1px solid #ced0d4; padding: 7.5px;\"><button type=\"button\" name=\"Stop\" style=\"background-color: #f6f7f9; color: #4b4f56; border: 1px solid #ced0d4; padding: 0 8px; line-height: 27.5px; font-weight: normal; font-family: 'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, 'sans-serif'; font-size: 14px;\">Stop</button></div></div>";
			LiUnfollow.style = "width: 300px; height: auto; background: #f6f7f9; z-index: 9999999999; position: fixed; top: calc(50% - 100px); right: calc(50% - 150px); border: 1px solid #ced0d4; border-radius: 2px; font-family: 'Gill Sans', 'Gill Sans MT', 'Myriad Pro', 'DejaVu Sans Condensed', Helvetica, Arial, 'sans-serif'; font-size: medium; font-weight: normal;";
		document.body.appendChild(LiUnfollow);

		/* ONCLICK EVENTS */
		/* NO BUTTON */
		if(document.querySelectorAll("#LiUnfollow [name=Close]")[0]) document.querySelectorAll("#LiUnfollow [name=Close]")[0].onclick = function() {
			document.querySelectorAll("#LiUnfollow")[0].outerHTML = "";
		};

		/* YES BUTTON */
		if(document.querySelectorAll("#LiUnfollow [name=Continue]")[0]) document.querySelectorAll("#LiUnfollow [name=Continue]")[0].onclick = function() {
			document.querySelectorAll("#LiUnfollow [name=Confirmation]")[0].style.display = "none";
			document.querySelectorAll("#LiUnfollow [name=Status]")[0].style.display = "block";
			UnfollowFunction = setInterval(function() {
				var UnfollowButton = document.querySelectorAll("ul > li [data-control-name=\"actor_follow_toggle\"].is-following");
				for(var i = UnfollowButton.length - 1; i>=0; i--) {
					TotalUnfollowed++;
					UnfollowButton[i].click();
					document.querySelectorAll("#LiUnfollow [name=TotalUnfollowed]")[0].innerHTML = Number(document.querySelectorAll("#LiUnfollow [name=TotalUnfollowed]")[0].innerHTML) + 1;
				}
			}, 1000);
			ScrollToBottom = setInterval(function() {
				window.scrollBy(0, 12.5);
			}, 15);
			function CheckPageEnd(LastHeight) {
				var CurrentHeight = document.body.scrollHeight;
				if(!(CurrentHeight > LastHeight)) {
					clearInterval(ScrollToBottom);
					clearInterval(UnfollowFunction);
					document.querySelectorAll("#LiUnfollow [name=Message]")[0].style.display = "block";
					document.querySelectorAll("#LiUnfollow [name=Stop]")[0].innerHTML = "Close";
				} else setTimeout(function() {
					CheckPageEnd(CurrentHeight);
				}, 7.5*1000);
			}
			CheckPageEnd(0);
		}

		/* STOP BUTTON */
		if(document.querySelectorAll("#LiUnfollow [name=Stop]")[0]) document.querySelectorAll("#LiUnfollow [name=Stop]")[0].onclick = function() {
			clearInterval(ScrollToBottom);
			clearInterval(UnfollowFunction);
			document.querySelectorAll("#LiUnfollow")[0].outerHTML = "";
		};
		/* END: RUN AFTER PAGE LOAD COMPLETE */
	}
}, 1000);
```

The CheckPageEnd() function will check for lsit end. When there are no more unfollow button, it will stop the task and show result.

```
function CheckPageEnd(LastHeight) {
	var CurrentHeight = document.body.scrollHeight;
	if(!(CurrentHeight > LastHeight)) {
		clearInterval(ScrollToBottom);
		clearInterval(UnfollowFunction);
		document.querySelectorAll("#LiUnfollow [name=Message]")[0].style.display = "block";
		document.querySelectorAll("#LiUnfollow [name=Stop]")[0].innerHTML = "Close";
	} else setTimeout(function() {
		CheckPageEnd(CurrentHeight);
	}, 7.5*1000);
}
```
The ScrollToBottom function will auto scroll to bottom  to discover unfollow able people.

```
ScrollToBottom = setInterval(function() {
	window.scrollBy(0, 12.5);
}, 15);
```
The UnfollowFunction will click on unfollow buttons. It will check for unfollow button every second.

```
UnfollowFunction = setInterval(function() {
	var UnfollowButton = document.querySelectorAll("ul > li [data-control-name=\"actor_follow_toggle\"].is-following");
	for(var i = UnfollowButton.length - 1; i>=0; i--) {
		TotalUnfollowed++;
		UnfollowButton[i].click();
		document.querySelectorAll("#LiUnfollow [name=TotalUnfollowed]")[0].innerHTML = Number(document.querySelectorAll("#LiUnfollow [name=TotalUnfollowed]")[0].innerHTML) + 1;
	}
}, 1000);
```
