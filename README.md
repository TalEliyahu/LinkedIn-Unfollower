# Can I bulk unfollow people or companies on LinkedIn?

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

```	chrome.tabs.executeScript(TAB ID, {
		file: "unfollow.js"
	});
```
