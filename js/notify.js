function notifyOn() {
	if (!window.Notification) {
		alert('Browser does not support notifications.');
	}
	else {
		// check if permission is already granted
		if (Notification.permission === 'granted') {
			// show notification here
			var notify = new Notification('ADS-B', {
				body: 'Notifications enabled',
				icon: 'https://adsb.chaos-consulting.de/favicon.ico',
			});
			notifyState=true;
			document.getElementById("notifyIndicator").innerHTML = '<i class="fas fa-comment" title="Notifications are enabled, click to disable"></i>';
		} else {
			// request permission from user
			Notification.requestPermission().then(function (p) {
				if (p === 'granted') {
					// show notification here
					var notify = new Notification('ADS-B', {
				body: 'Notifications enabled',
				icon: 'https://adsb.chaos-consulting.de/favicon.ico',
			});
			notifyState=true;
			document.getElementById("notifyIndicator").innerHTML = '<i class="fas fa-comment" title="Notifications are enabled, click to disable"></i>';
				} else {
					alert('User blocked notifications.');
				}
			}).catch(function (err) {
				console.error(err);
			});
		}
	}
}

function notifyOff(){
	notifyState=false;
	document.getElementById("notifyIndicator").innerHTML = '<i class="fas fa-comment-slash" title="Notifications are disabled, click to enable"></i>';
	notifySoundOff();
}

function notifyToggle(){
	if(!notifyState){
		notifyOn();
	}
	else{
		notifyOff();
	}
}

function notifySoundOn(){
	notifySound=true;
	document.getElementById("notifySoundIndicator").innerHTML = '<i class="fas fa-volume-up" title="Sound is enabled, click to disable"></i>';
}

function notifySoundOff(){
	notifySound=false;
	document.getElementById("notifySoundIndicator").innerHTML = '<i class="fas fa-volume-mute" title="Sound is disabled, click to enable"></i>';
}

function notifySoundToggle(){
	if(!notifySound){
		notifySoundOn();
	}
	else{
		notifySoundOff();
	}
}

function notify(text, hex) {
	if (notifyState) {
		var notify = new Notification('ADS-B', {
			body: text,
			icon: 'https://adsb.chaos-consulting.de/favicon.ico',
			badge: 'https://adsb.chaos-consulting.de/favicon.ico',
		});
		notify.onclick = function(){
			planeSelect(hex, true);
		}
		if(notifySound){
			const audio = new Audio('notify.mp3');
			audio.play();
		}
	}
}
