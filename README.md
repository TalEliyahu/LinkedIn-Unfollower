# Unfllower
Unfollow all the companies or contacts you don't need in one click.



# Can I bulk unfollow people or companies on LinkedIn?

1. If you are using chrome go the page that shows who you are following  https://www.linkedin.com/feed/following/
2. Press F12 to see the console.
3. Copy Paste this to console:

```var buttons = $("button"),
interval = setInterval(function(){
	var btn = $('.is-following');
   	console.log("Clicking:", btn);
    btn.click();
    if (buttons.length === 0) {
    	clearInterval(interval);
    }
}, 1000);
```
4. Press Enter.

<a href="https://user-images.githubusercontent.com/31100945/29992087-17962570-8fc6-11e7-87b9-698561973c3e.gif" target="_blank"><img src="https://user-images.githubusercontent.com/31100945/29992087-17962570-8fc6-11e7-87b9-698561973c3e.gif" alt="56c6bd17-d834-480c-y917-4b719f91eb03" style="max-width:100%;"></a>
