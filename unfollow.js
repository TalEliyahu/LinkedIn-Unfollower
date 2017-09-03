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