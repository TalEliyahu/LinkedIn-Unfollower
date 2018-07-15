Array.prototype.forEach.call(document.querySelectorAll('.expandable'), function(expandable) {
	expandable.querySelector('.expander').addEventListener('click', function(e) {
		document.querySelectorAll('.expandable').forEach(function(otherExpandable) {
			if (otherExpandable !== expandable)
				otherExpandable.classList.remove('expanded');
		});
		expandable.classList.toggle('expanded');
	});
});

Array.prototype.forEach.call(document.querySelectorAll('[data-command]'), function(link) {
	link.addEventListener('click', function(e) {
		chrome.extension.sendMessage({msg: link.getAttribute('data-command')});
		close();
	});
});

function saveOptions(input){
	

}

document.querySelector('#close').addEventListener('click', function(e) {close();});

document.querySelector('#options').addEventListener('click', function(){
	document.querySelector('#menu').style.display = 'none';
	document.querySelector('#options_content').style.display = 'block';
});

document.querySelector('#close_options').addEventListener('click', function(){
	document.querySelector('#menu').style.display = 'block';
	document.querySelector('#options_content').style.display = 'none';
});

document.querySelector('#wait').addEventListener('keyup', function(){
	var value = this.value;
	chrome.storage.sync.set({'wait': value}, function(){});
});

document.querySelector('#limit').addEventListener('keyup', function(){
	var value = this.value;
	chrome.storage.sync.set({'limit': value}, function(){});
});

chrome.storage.sync.get(['wait'], function(result){
	var value = result.wait;
	
	if(typeof value == 'undefined'){
		value = '800';
	}
	
	document.querySelector('#wait').value = value;
});

chrome.storage.sync.get(['limit'], function(result){
	var value = result.limit;
	
	if(typeof value == 'undefined'){
		value = '1000';
	}
	
	document.querySelector('#limit').value = value;
});