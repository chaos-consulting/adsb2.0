//planeSelect
function planeSelect(pid, focus=false, zoom=false) {
	
	vehicleDeSelect('plane');
	id=pid;
	clearSidebar();
	vehiclePositionOld;
	document.getElementById("planeContent").style = "display:block";
	sidebarShow();
	//planeSpeedOld;
	window.history.pushState("","","?plane=" + id);
	//history
	cellRefresh("planeId", id);
	console.log('Focus=' + focus);
	var plane;
	fetch(urlBase + '/data/planeHistory.php?plane=' + id)
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		plane = data;
//		if(data.timestamp != null){
		if(true){
			planeInfoRefresh(data);
			console.log('first');
			if(focus){
				vehicleFocusOn();
				console.log('PFon');
			}
			if(zoom != false){
				map.setZoom(zoom);
			}
		}
		else{
			//problem
			//planeDeSelect();
		}
	});

	document.getElementById("exportTrackGeojson").href = urlBase + '/data/export.php?plane=' + id;

	//Load history from server
	fetch(urlBase + '/track/?plane=' + id)
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		globalThis.track = L.geoJSON(data, {
			style: function(feature) {
				return {
					color: altitudeToColor(feature.properties.altitude),
					dashArray: feature.properties.dashArray,
					opacity: feature.properties.opacity
				};
			},
			onEachFeature: function (feature, layer){
				layer.bindTooltip(new Date(Math.floor(feature.properties.timestamp)*1000) + "<br>Altitude: " + Math.round(feature.properties.altitude/3.28269) + "m / " + feature.properties.altitude + "ft");
			}
//		}).addTo(map);
		}).addTo(trackGroup);
	}).then(function() {
		//History stuff for a non live plane
		if(!(id in aircrafts)){
			d = Object.values(track._layers)[0]._latlngs[0];
			var fakeFeature = { properties: { model: plane.model, track: 0, opacity: 1, type: "his" }};
			planeGhostMarker = L.marker(d, {
				icon: planeIcon(fakeFeature)
			}).addTo(track);
		}
		//console.log(map);
	});
}

//shipSelect
function shipSelect(pid, focus=false, zoom=false) {
	vehicleDeSelect('ship');
	id=pid;
	clearSidebar();
	document.getElementById("shipContent").style = "display:block";
	sidebarShow();
	//planeSpeedOld;
	window.history.pushState("","","?ship=" + id);
	//history
	cellRefresh("shipId", id);
	/*var plane;
	fetch(urlBase + '/data/planeHistory.php?plane=' + id)
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		plane = data;
		if(data.timestamp != null){
			planeInfoRefresh(data);*/
			if(focus){
				vehicleFocusOn();
			}
			if(zoom != false){
				map.setZoom(zoom);
			}
		/*}
		else{
			//problem
			//planeDeSelect();
		}
	});
*/
document.getElementById("exportShipTrackGeojson").href = urlBase + '/data/export.php?ship=' + id;

	//Load history from server
	fetch(urlBase + '/data/shipTrack.php?ship=' + id)
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		//If there is a position in it add it to the map
		globalThis.track = L.geoJSON(data, {
			style: function(feature) {
				return {
					color: '#3388ff',
					dashArray: feature.properties.dashArray
				};
			},
			onEachFeature: function (feature, layer){
				layer.bindTooltip(new Date(Math.floor(feature.properties.timestamp)*1000) + "<br>");
			}
		}).addTo(trackGroup);
	}).then(function() {
		//History stuff for a non live plane
		/*if(!(id in aircrafts)){
			d = Object.values(track._layers)[0]._latlngs[0];
			var fakeFeature = { properties: { model: plane.model, track: 0, opacity: 1, type: "his" }};
			planeGhostMarker = L.marker(d, {
				icon: planeIcon(fakeFeature)
			}).addTo(track);
		}*/
	});
	globalThis.track = L.geoJSON().addTo(map);
}

//Die beiden Funktionen müssen weg weil durch vehicleDeSelect ersetzt
//shipDeSelect
function shipDeSelect() {
	vehicleDeSelect();
	shipListShow();
}

//planeDeSelect
function planeDeSelect() {
	vehicleDeSelect();
	planeListShow();
}

//vehicleDeSelect
function vehicleDeSelect(vehicle=false) {
	vehicleSpeedOld;
	vehiclePositionOld=undefined;
	planeAltitudeOld;
	planeDirectionOld;
	removeTrack();
	window.history.pushState("","","?");
	if(!vehicle){
		sidebarPanelShow('planeList');
	}else if(vehicle=='plane'){
		sidebarPanelShow('planeList');
	}else if(vehicle=='ship'){
		sidebarPanelShow('shipList');
	}
	id=undefined;
}

//Focus tracking plane
//vehicleFocusToggle
function vehicleFocusToggle() {
	if(!vehicleInFocus){
		vehicleFocusOn();
	}
	else{
		vehicleFocusOff();
	}
}

//vehicleFocusOn
function vehicleFocusOn(){
	vehicleInFocus = true;
	document.getElementById("vehicleFocus").style = "color:#0f0;"
	document.getElementById("vehicleFocus2").style = "color:#0f0;"
}

//vehicleFocusOff
function vehicleFocusOff(){
	vehicleInFocus = false;
	document.getElementById("vehicleFocus").style = "color:white;"
	document.getElementById("vehicleFocus2").style = "color:white;"
}

//removeTrack
/*function removeTrack(){
	if(map.hasLayer(track)) {
		map.removeLayer(track);
	}
}*/
function removeTrack(){
	trackGroup.clearLayers();
}
