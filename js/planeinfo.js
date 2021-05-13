function cellRefresh(cell, value){
	if(typeof value !== 'undefined'){
		if(document.getElementById(cell).innerHTML != value){
			document.getElementById(cell).innerHTML = value;
		}
	}
	else{
		document.getElementById(cell).innerHTML = 'n/a';
	}
}

function planeInfoRefresh(f){
	//Info
	cellRefresh("planeId", f.hex);
	cellRefresh("planeFlight", f.flight);
	cellRefresh("planeCountry", f.country);
	cellRefresh("planeAirline", f.airline);
	cellRefresh("planeRegistration", f.registration);
	cellRefresh("planeModel", f.model);
	cellRefresh("planeModelLong", f.modelLong);
	cellRefresh("planeSquawk", f.squawk);
	cellRefresh("planeSquawkLong", f.squawkLong);
	cellRefresh("planeSeen", f.seen);
	if(typeof f.picture !== 'undefined'){
		document.getElementById("planePicture").innerHTML='<img src="' + f.picture + '">';
		if(f.picture.includes("aircraft")){
			document.getElementById("planeDescription").innerHTML='This is a picture of ' + f.registration + ' which is a '+ f.modelLong;
		}
		else{
			document.getElementById("planeDescription").innerHTML='Serving suggestion of a ' + f.modelLong + ' <i class="fas fa-birthday-cake"></i>';
		}
	}
	else{
		document.getElementById("planePicture").innerHTML='There is no picture available';
		document.getElementById("planeDescription").innerHTML='';
	}
	document.getElementById("planeLink").innerHTML = '<a href="?plane=' + f.hex + '">' + urlBase + '/?plane=' + f.hex + '</a>';

	//Position
	if(typeof f.lat !== 'undefined'){
		document.getElementById("planeLatLon").innerHTML = f.lat + ' / ' + f.lon;
	}
	else{
		document.getElementById("planeLatLon").innerHTML = 'n/a';
	}
	if(typeof f.track !== 'undefined'){
		//Hier gibt es nen 360=0° Bug
		var planeDirectionIndicator='';
		if(typeof planeDirectionOld !== 'undefined'){
			var planeDirectionDiff = f.track - planeDirectionOld;
			if(planeDirectionDiff < 0){
				planeDirectionIndicator='<i class="fas fa-undo-alt"></i>';
			}
			if(planeDirectionDiff > 0){
				planeDirectionIndicator='<i class="fas fa-redo-alt"></i>';
			}
		}
		planeDirectionOld = f.track;
		document.getElementById("planeTrack").innerHTML = f.track + '° ' + planeDirectionIndicator;
	}
	else{
		document.getElementById("planeTrack").innerHTML = 'n/a';
	}
	if(typeof f.lat !== 'undefined'){
		document.getElementById("planeSeenPos").innerHTML = f.seen_pos + 's';
	}
	else{
		document.getElementById("planeSeenPos").innerHTML = 'n/a';
	}
	//Altitude/Speed
	if(typeof f.altitude !== 'undefined'){
		var planeAltitudeIndicator='';
		if(typeof planeAltitudeOld !== 'undefined'){
			var planeAltitudeDiff = f.altitude - planeAltitudeOld;
			if(planeAltitudeDiff < 0){
				planeAltitudeIndicator ='<i class="fas fa-caret-down"></i>';
			}
			if(planeAltitudeDiff > 0){
				planeAltitudeIndicator ='<i class="fas fa-caret-up"></i>';
			}
		}
		planeAltitudeOld = f.altitude;
		document.getElementById("planeAltitudeNowMetric").innerHTML = ftToM(f.altitude) + 'm ' + planeAltitudeIndicator;
		document.getElementById("planeAltitudeNow").innerHTML = f.altitude + 'ft ' + planeAltitudeIndicator;
	}
	else{
		document.getElementById("planeAltitudeNowMetric").innerHTML = 'n/a';
		document.getElementById("planeAltitudeNow").innerHTML = 'n/a';
	}
	if(typeof f.speed !== 'undefined'){
		var planeSpeedIndicator='';
		if(typeof planeSpeedOld !== 'undefined'){
			var planeSpeedDiff = f.speed - planeSpeedOld;
			if(planeSpeedDiff < 0){
				planeSpeedIndicator = '<i class="fas fa-caret-down"></i>';
			}
			if(planeSpeedDiff > 0){
				planeSpeedIndicator = '<i class="fas fa-caret-up"></i>';
			}
		}
		planeSpeedOld = f.speed;
		document.getElementById("planeSpeedNowMetric").innerHTML = ktToKmh(f.speed) + 'km/h ' + planeSpeedIndicator;
		document.getElementById("planeSpeedNow").innerHTML = f.speed + 'kt ' + planeSpeedIndicator;
	}
	else{
		document.getElementById("planeSpeedNowMetric").innerHTML = 'n/a';
		document.getElementById("planeSpeedNow").innerHTML = 'n/a';
	}
}
