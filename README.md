# Unfllower
Unfollow all the contacts you don't need in one click


# Can I bulk unfollow people on LinkedIn?

1. Go to your followers page: https://www.linkedin.com/feed/following/
2. Press F12 to see the concsole.
3. Copy Paste this to console and see the magic happing.

var buttons = $("button"),
interval = setInterval(function(){
	var btn = $('.is-following');
   	console.log("Clicking:", btn);
    btn.click();
    if (buttons.length === 0) {
    	clearInterval(interval);
    }
}, 1000);
