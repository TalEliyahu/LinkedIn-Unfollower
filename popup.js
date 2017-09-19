Array.prototype.forEach.call(document.querySelectorAll('.expandable'), function(expandable) {
	expandable.querySelector('.expander').addEventListener('click', function(e) {expandable.classList.toggle('expanded');});
});

Array.prototype.forEach.call(document.querySelectorAll('[data-command]'), function(link) {
	link.addEventListener('click', function(e) {
		chrome.extension.sendMessage({msg: link.getAttribute('data-command')});
		close();
	});
});

document.querySelector('#close').addEventListener('click', function(e) {close();});
