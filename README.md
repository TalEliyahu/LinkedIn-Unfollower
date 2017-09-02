# Unfllower
Unfollow all the companies or contacts you don't need in one click Edit
Add topics


# Can I bulk unfollow people on LinkedIn?

1. If you are using chrome go the page that shows who you are following  https://www.linkedin.com/feed/following/
2. Press F12 to see the console.
3. Copy Paste this to console and see the magic happing.

```var buttons = $("button"),
interval = setInterval(function(){
	var btn = $('.is-following');
   	console.log("Clicking:", btn);
    btn.click();
    if (buttons.length === 0) {
    	clearInterval(interval);
    }
}, 1000);
