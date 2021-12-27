function cellRefresh(cell, value, text){
	if(typeof value !== 'undefined'){
		if(document.getElementById(cell).innerHTML != value){
			document.getElementById(cell).innerHTML = value;
			if(typeof text !== 'undefined'){
				document.getElementById(cell).innerHTML += text;
			}
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
		if(typeof vehicleSpeedOld !== 'undefined'){
			var planeSpeedDiff = f.speed - vehicleSpeedOld;
			if(planeSpeedDiff < 0){
				planeSpeedIndicator = '<i class="fas fa-caret-down"></i>';
			}
			if(planeSpeedDiff > 0){
				planeSpeedIndicator = '<i class="fas fa-caret-up"></i>';
			}
		}
		vehicleSpeedOld = f.speed;
		document.getElementById("planeSpeedNowMetric").innerHTML = ktToKmh(f.speed) + 'km/h ' + planeSpeedIndicator;
		document.getElementById("planeSpeedNow").innerHTML = f.speed + 'kt ' + planeSpeedIndicator;
	}
	else{
		document.getElementById("planeSpeedNowMetric").innerHTML = 'n/a';
		document.getElementById("planeSpeedNow").innerHTML = 'n/a';
	}
}

function shipInfoRefresh(f){
	//Info
	cellRefresh("shipId", f.mmsi);
	cellRefresh("shipName", f.shipname);
	cellRefresh("shipCallsign", f.callsign);
	cellRefresh("shipDestination", f.destination);
	cellRefresh("shipStatus", f.status);
	cellRefresh("shipStatusText", f.status_text);
	cellRefresh("shipType", f.shiptype);
	cellRefresh("shipTypeText", f.shiptype_text);
	cellRefresh("shipCountry", f.country);
	//cellRefresh("shipStation", f.station);

	var length = Math.abs(parseInt(f.to_bow) + parseInt(f.to_stern));
	cellRefresh("shipLength", length, 'm');
	var width = Math.abs(parseInt(f.to_port) + parseInt(f.to_starboard));
	cellRefresh("shipWidth", width, 'm');
	cellRefresh("shipDraught", f.draught, 'm');
	cellRefresh("shipEta", eta(f.eta));
	//console.log(f.to_bow + ' ' + f.to_stern + ' ' + length);

	var ts = Math.abs(parseInt(Date.now()/1000) - parseInt(f.timestamp)) + 's';
	cellRefresh("shipSeen", ts);
	document.getElementById("shipLink").innerHTML = '<a href="?ship=' + f.mmsi + '">' + urlBase + '/?ship=' + f.mmsi + '</a>';

	//Position
	if(typeof f.lat !== 'undefined'){
		document.getElementById("shipLatLon").innerHTML = f.lat + ' / ' + f.lon;
	}
	else{
		document.getElementById("shipLatLon").innerHTML = 'n/a';
	}
	if(typeof f.course !== 'undefined'){
		//Hier gibt es nen 360=0° Bug
		var shipDirectionIndicator='';
		if(typeof vehicleDirectionOld !== 'undefined'){
			var shipDirectionDiff = f.track - vehicleDirectionOld;
			if(shipDirectionDiff < 0){
				shipDirectionIndicator='<i class="fas fa-undo-alt"></i>';
			}
			if(shipDirectionDiff > 0){
				shipDirectionIndicator='<i class="fas fa-redo-alt"></i>';
			}
		}
		vehicleDirectionOld = f.track;
		document.getElementById("shipCourse").innerHTML = f.course + '° COG' + shipDirectionIndicator;
	}
	else{
		document.getElementById("shipCourse").innerHTML = 'n/a';
	}

	if(typeof f.heading !== 'undefined'){
		//Hier gibt es nen 360=0° Bug
		var shipDirectionIndicator='';
		/*if(typeof vehicleDirectionOld !== 'undefined'){
			var shipDirectionDiff = f.track - vehicleDirectionOld;
			if(shipDirectionDiff < 0){
				shipDirectionIndicator='<i class="fas fa-undo-alt"></i>';
			}
			if(shipDirectionDiff > 0){
				shipDirectionIndicator='<i class="fas fa-redo-alt"></i>';
			}
		}
		vehicleDirectionOld = f.track;*/
		document.getElementById("shipHeading").innerHTML = f.heading + '° HDG' + shipDirectionIndicator;
	}
	else{
		document.getElementById("shipHeading").innerHTML = 'n/a';
	}

	//Speed
	if(typeof f.speed !== 'undefined'){
		var shipSpeedIndicator='';
		if(typeof vehicleSpeedOld !== 'undefined'){
			var shipSpeedDiff = f.speed - vehicleSpeedOld;
			if(shipSpeedDiff < 0){
				shipSpeedIndicator = '<i class="fas fa-caret-down"></i>';
			}
			if(shipSpeedDiff > 0){
				shipSpeedIndicator = '<i class="fas fa-caret-up"></i>';
			}
		}
		vehicleSpeedOld = f.speed;
		document.getElementById("shipSpeedNowMetric").innerHTML = ktToKmh(f.speed) + 'km/h ' + shipSpeedIndicator;
		document.getElementById("shipSpeedNow").innerHTML = f.speed + 'kt ' + shipSpeedIndicator;
	}
	else{
		document.getElementById("shipSpeedNowMetric").innerHTML = 'n/a';
		document.getElementById("shipSpeedNow").innerHTML = 'n/a';
	}


/*
	if(typeof f.picture !== 'undefined'){
		document.getElementById("shipPicture").innerHTML='<img src="' + f.picture + '">';
		if(f.picture.includes("aircraft")){
			document.getElementById("shipDescription").innerHTML='This is a picture of ' + f.registration + ' which is a '+ f.modelLong;
		}
		else{
			document.getElementById("shipDescription").innerHTML='Serving suggestion of a ' + f.modelLong + ' <i class="fas fa-birthday-cake"></i>';
		}
	}
	else{
		document.getElementById("shipPicture").innerHTML='There is no picture available';
		document.getElementById("shipDescription").innerHTML='';
	}
	*/

/*
*/
}

function eta(e){
	if(typeof e === 'undefined'){
		return "n/a";
	}
	//05-27T20:00Z
	var split = e.split("-");
	var splitMonth = split[0];
	var split2 = split[1].split("T");
	var splitDay = split2[0];
	var split3 = split2[1].split("Z");
	var splitTime = split3[0];
	return splitDay + "." + splitMonth + " " + splitTime;
}
