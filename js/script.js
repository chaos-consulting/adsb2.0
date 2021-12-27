/****************************************/
/****************BUGS********************/
/****************************************/
//Flightnumber verschwindet, wenn a/c nicht mehr empfangen wird

/****************************************/
/*Changes Since second stable release*/
/****************************************/
//tankovale
//geolocation



/****************************************/
/*****Features - for next release********/
/****************************************/
//Explanations unten abgeschnitten
//Caching der stations bei planes verkürzen
//Mlats die keine sind weil irgendwer keine koords bekommt und dann das mlatten anfängt



/****************************************/
/**********Features - later on***********/
/****************************************/
//Neue Datenbank
//Stations Graphen + Stats
//Overall Graphen + stats
//Mlat Sync Meshviewer
//Receiver to selectet plane lines
//Colors in History Table
//f8ax
//Heliports
//B38M
//B739
//B462 -> https://en.wikipedia.org/wiki/British_Aerospace_146


//Ship Picture
//Info refresh initial unabhängig vom realtime triggern für besere response und um den ship realtime wieder auf 5sec zu setzen
//https://raruto.github.io/leaflet-elevation/examples/leaflet-elevation_speed-chart.html
//https://www.hamspirit.de/1367/wie-du-ein-aprs-igate-auf-einem-raspberry-pi-installierst/

//Cache indicator
//Mobilemode X nur bei Bedarf anzeigen
//ship stats

/****************************************/
/************Initial stuff***************/
/****************************************/

/****************************************/
/***************Variables****************/
/****************************************/
//Basedir
var urlBase = 'https://adsb.chaos-consulting.de/alpha';
var urlHistory = urlBase + '/data/planesHistory.json';

//Map
var map = L.map('map',{
	//crs: L.CRS.EPSG4326,
	zoomControl: false
	}).setActiveArea({
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '400px',
		bottom: '0px'
});

L.tileLayer.wms("https://map.chaos-consulting.de/service", {
	layers: 'osm',
	format: 'image/png',
	styles: '',
	transparent: false,
	opacity: 1,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors (<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>)'
}).addTo(map);

/*DWD WMS Geraffel*/
var precipitationLayer = L.tileLayer.wms("https://map.chaos-consulting.de/service", {
	layers: 'dwd:Niederschlagsradar',
	format: 'image/png',
	styles: '',
	transparent: true,
	opacity: 0.6,
	attribution: '<a href="https://www.dwd.de/">Deutscher Wetterdienst</a>'
});

var weatherWarningLayer = L.tileLayer.wms("https://map.chaos-consulting.de/service", {
	layers: 'Warnungen_Gemeinden',
	format: 'image/png',
	styles: '',
	transparent: true,
	opacity: 0.6,
	attribution: 'Geobasisdaten Gemeinden: &copy; <a href="https://www.bkg.bund.de">BKG</a> 2015 (Daten verändert)'
});

var openSeaMapLayer = L.tileLayer.wms("https://map.chaos-consulting.de/service", {
	layers: 'seamark',
	format: 'image/png',
	styles: '',
	transparent: true,
	attribution: '&copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
});

var pegelOnlineLayer = L.tileLayer.wms("https://map.chaos-consulting.de/service", {
	layers: 'PegelOnline',
	format: 'image/png',
	styles: '',
	transparent: true,
	attribution: '&copy; <a href="https://www.pegelonline.wsv.de/">WSV</a> (CC-BY 4.0)'
});

var windLayer = L.tileLayer.wms("https://map.chaos-consulting.de/service", {
	layers: 'wind',
	format: 'image/png',
	styles: '',
	transparent: true,
	attribution: '&copy; <a href="https://www.dwd.de/">Deutscher Wetterdienst</a>',
	pane: 'popupPane'
});

//aircrafts
var aircrafts;

//Stations
var stationLayer;
var stationSelected;
var stationMlatPeersTableData =[];

//Airports
var airportLayer;

//Heatmap
var heatmapLayer;
var heatmapLayerActive = false;

//Vehicle
//Speed&Altitude
//var planeSpeedOld;
var vehicleSpeedOld;
var planeAltitudeOld;
var planeDirectionOld;
var vehicleDirectionOld;
var vehiclePositionOld;


//Track
var track;

//History ghostmarker
var planeGhostMarker;

//Crosshairs tracking
var vehicleInFocus = false;

//Tables
var planesHistoryTableData =[];

//Sidebar
var sidebar = true;

//Filters
var filterType = 'all';
var filterStation = 'all';
var filterAltitude = 999999;
var filterModel = 'all';
var filterFix = 'all';
var filterSource = 'all';
var filterSelected = 'all';

//magic
var magic = false;
var magicTime = 0;

//Notifications
var notifyState = false;
var notifyCache = [];
var notifySound = false;

//mobile
var mobile = false;
var extra = false;

var geolocation = false;

//
var mesh = false;
var meshLayer;

//Layergroup
var trackGroup = L.layerGroup().addTo(map);

//Leaflet map
map.attributionControl.setPosition('bottomleft');

map.on('click', vehicleDeSelect);

//Realtime layer for planes
planeLayer = L.realtime(function(success, error) {
	fetch(urlBase + '/data/aircraft.json')
	.then(function(response) { return response.json(); })
	.then(function(dataIn) {

		//
		aircrafts=dataIn.aircraft;

		//Variables
		var tableData = [];
		var planeStations = [];
		var dataOut = {
			type: 'FeatureCollection',
			features: []
		}

		//Tasks per plane
		Object.values(dataIn.aircraft).forEach(
			function planeStation(f) {

				//Hier wird gefiltert
				var include = true;

				//filterType
				if(filterType != 'all'){
					if(filterType != f.type){
						include = false
						if(filterType=='bim'){
							if(f.type == 'bos' || f.type == 'int' || f.type == 'mil'){
								include = true;
							}
						}
					}
				}

				//filterStation
				if(filterStation != 'all'){
					if(!(filterStation in f.station)){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitude != 999999){
					if(filterAltitude < f.altitude){
						include = false;
					}
				}

				//filterFix
				if(filterFix != 'all'){
					if(filterFix != f.fix){
						include = false;
					}
				}

				//filterSource
				if(filterSource != 'all'){
					if(filterSource != 'adsb'){
						include = false;
					}
				}

				//filterSelected
				if(filterSelected != 'all'){
					if(id != undefined){
						if(f.hex != id){
							include = false;
						}
					}
				}

				if(include == true){
				//planesTableData
				tableData.push({
					'hex': f.hex,
					'flight': f.flight,
					'altitude': ftToM(f.altitude),
					'speed': ktToKmh(f.speed),
					'track': f.track,
					'type': f.type,
					'fix': fixToIcon(f.fix)
				});

				//Map stuff LeafletRealtime GeoJson
				if(typeof f.lat !== 'undefined' && typeof f.lon !== 'undefined'){

					//Mlat -> Opacity
					if(typeof f.mlat !== 'undefined'){
						var opacity = 0.6
					}
					else{
						var opacity = 1
					}

					//Push the plane to GeoJson
					dataOut.features.push({
						"geometry": {
							"type": "Point",
							"coordinates": [f.lon, f.lat]
						},
						"type": "Feature",
						"properties": {
							"id":f.hex,
							"track":f.track,
							"altitude":f.altitude,
							"opacity":opacity,
							"category":f.category,
							"model":f.model,
							"type":f.type
						}
					})
				}

				//Notifications
				if(notifyState){
					if(!notifyCache.includes(f.hex)){
						if(f.type == 'mil' || f.type == 'bos' || f.type == 'int'){
							notifyCache.push(f.hex);
							notify(f.hex + ' is in the Air as ' + f.flight, f.hex);
						}
					}
				}

				//Selected plane stuff
				if(id === f.hex){

					planeInfoRefresh(f);

					//focus
					if(vehicleInFocus){
						if(typeof f.lat !== 'undefined' && typeof f.lon !== 'undefined'){
							map.panTo([f.lat, f.lon]);
						}
					}

					//Stations
					var tmp = f["station"];
					Object.values(f.station).forEach(
						function planeStation(i) {
							//var dist = mToKm(i.dist) + 'Km / ' + i.dist + "m";
							var dist = "";
							if(typeof i.dist !== 'undefined'){
								dist = mToKm(i.dist) + 'Km';
							}
							planeStations.push({"name": i.name, "fix": fixToIcon(i.fix), "rssi": i.rssix, "dist": dist});
						}
					);
					planeStationsTable.replaceData(planeStations);
				}
			}
		}
		)

		//Push the GeoJson to LeafletRealtime
		success(dataOut);

		//Refresh planesTableData
		table.replaceData(tableData);

		//Refresh stationsTableData
		stationData();
		//stationTable.replaceData();

		if(document.getElementById("navbarDesktop").style.display == "none"){
			if(!mobile){
				sidebarHide();
				mobile=true;
			}
		}

		//magic
		if(getUrlVars()["magic"]){
			magicOn();
		}
		if(magic){
			if(magicTime < 1){
				var canidate = dataOut.features[Math.floor(Math.random() * dataOut.features.length)];
				if(canidate.properties.type=='mil' || canidate.properties.type=='bos' || canidate.properties.type=='int' || canidate.properties.altitude < 13500){
					planeSelect(canidate.properties.id);
					vehicleFocusOn();
					document.getElementById("magicToggle").className = 'buttonActive';
					magicTime=15;
					if(canidate.properties.altitude < 3000){
						map.setZoom(13);
					}
					else{
						map.setZoom(9);
					}
				}
			}
			magicTime --;
		}
	})
	.catch(error);
}, {
	//Ever so often
	interval: 1 * 1000,

	//Generate Plane markers via div and svg
	pointToLayer: function (feature, latlng) {
		return L.marker(L.latLng(latlng), {
			icon: planeIcon(feature),
			zIndexOffset: parseInt(feature.properties.altitude) + 1000
		}).on('click', onClick);
		function onClick(e) {
			planeSelect(feature.properties.id);
		}
	},
	updateFeature: function(feature, oldLayer) {
		if (!oldLayer){ return; }
		oldLayer.setIcon(
			planeIcon(feature)
		);

		var c = feature.geometry.coordinates;
		oldLayer.setLatLng([c[1], c[0]]);
		oldLayer.setZIndexOffset(parseInt(feature.properties.altitude) + 1000);

		if(feature.properties.id == id) {
			if(typeof planeGhostMarker !== 'undefined') {
				planeGhostMarker.remove();
			}

			if(map.hasLayer(track)){

				if(typeof vehiclePositionOld === 'undefined'){
					d = Object.values(track._layers)[0]._latlngs[0];
					vehiclePositionOld=[d['lng'], d['lat']];
				}
				/*track.addData({
					"type":"LineString",
					"properties":{
						"timestamp": Date.now()/1000,
						"altitude": feature.properties.altitude,
						"opacity": feature.properties.opacity
					},
					"coordinates":[
						c,
						vehiclePositionOld
					]
				});*/
				track.addData({
					"type":"Feature",
					"properties":{
						"altitude":feature.properties.altitude,
						"opacity":feature.properties.opacity,
					},
					"geometry":{
						"type":"LineString",
						"coordinates":[
							c,
							vehiclePositionOld
						]
					}
				});
				vehiclePositionOld=c;
			}
		}
		return oldLayer;
	},
}).addTo(map);

/*
 {
			"type":"Feature",
			"properties":{
				"altitude":"5975",
				"color":"#3388ff",
				"opacity":"15",
				"timestamp":"1628011209.2"
			},
			"geometry":{
				"type":"LineString",
				"coordinates":[
					[
						6.80443,
						51.1473
					],
					[
						6.86111,
						51.1504
					]
				]
			}
		},
*/

/*******************************/
/*****SCHIFFE******************/
//Realtime layer for planes
shipLayer = L.realtime(function(success, error) {
	fetch('https://adsb.chaos-consulting.de/alpha/data/ships.json')
	.then(function(response) { return response.json(); })
	.then(function(dataIn) {
		//
		ships=dataIn.ships;

		//Variables
		var shipsTableData=[];
		var shipStations = [];
		var dataOut = {
			type: 'FeatureCollection',
			features: []
		}

		//Tasks per ship
		Object.values(dataIn.ships).forEach(

			function(f){

				//Hier wird gefiltert
				var include = true;

				//filterType
				if(filterType != 'all'){
					if(filterType != f.type){
						include = false
						if(filterType=='bim'){
							if(f.type == 'bos' || f.type == 'int' || f.type == 'mil'){
								include = true;
							}
						}
					}
				}

				//filterStation
				if(filterStation != 'all'){
					if(!(filterStation in f.station)){
						include = false;
					}
				}

				//filterSource
				if(filterSource != 'all'){
					if(filterSource != 'ais'){
						include = false;
					}
				}

				//filterFix
				if(filterFix != 'all'){
					if(filterFix != f.fix){
						include = false;
					}
				}

				//filterAltitude
				if(filterAltitude != 999999){
					if(filterAltitude < f.altitude){
						include = false;
					}
				}

				//filterSelected
				if(filterSelected != 'all'){
					if(id != undefined){
						if(f.mmsi != id){
							include = false;
						}
					}
				}

				if(include){
					shipsTableData.push({
						'mmsi': f.mmsi,
						'name': f.shipname,
						'callsign': f.callsign,
						'speed': ktToKmh(f.speed),
						'type': f.type
					});

					if(typeof f.lon !== 'undefined' && typeof f.lat !== 'undefined'){
						//Push the plane to GeoJson
						var ttrack = f.heading;
						if(f.heading == 511 && f.course != 360){
							ttrack=f.course;
						}
						dataOut.features.push({
							"geometry": {
								"type": "Point",
								"coordinates": [f.lon, f.lat]
							},
							"type": "Feature",
							"properties": {
								"id":f.mmsi,
								"track":ttrack,
								"altitude":2000,
								"opacity":Math.abs(1-0.0004*timeFromNow(f.timestamp)),
								"type":f.type,
								"statusLong":f.status_text,
								"to_bow":f.to_bow,
								"to_stern":f.to_stern,
								"to_port":f.to_port,
								"to_starboard":f.to_starboard,
								"model": f.model
							}
						})
					}
				}

				//Selected ship stuff
				if(id === f.mmsi){
					shipInfoRefresh(f);

				Object.values(f.station).forEach(
					function shipStation(i) {
						var dist = "";
						if(typeof i.dist !== 'undefined'){
							dist = mToKm(i.dist) + 'Km';
						}
						shipStations.push({"name": i.name, "fix": fixToIcon(i.fix), "dist": dist});
					}
				);
				shipStationsTable.replaceData(shipStations);

					//focus
					if(vehicleInFocus){
						if(typeof f.lat !== 'undefined' && typeof f.lon !== 'undefined'){
							map.panTo([f.lat, f.lon]);
						}
					}
				}
			}
		)

		//Refresh planesTableData
		shipsTable.replaceData(shipsTableData);

		success(dataOut);
	})
}, {
	//Ever so often
	interval: 1 * 1000,

	//Generate Plane markers via div and svg
	pointToLayer: function (feature, latlng) {
		return L.marker(L.latLng(latlng), {
			icon: shipIcon(feature)
		}).on('click', onClick);
		function onClick(e) {
			shipSelect(feature.properties.id);
		}
	},
	updateFeature: function(feature, oldLayer) {
		if (!oldLayer){ return; }
		oldLayer.setIcon(
			shipIcon(feature)
		);
		//console.log(oldLayer._icon);
		var c = feature.geometry.coordinates;
		oldLayer.setLatLng([c[1], c[0]]);

		if(feature.properties.id == id) {
			if(typeof vehicleGhostMarker !== 'undefined') {
				vehicleGhostMarker.remove();
			}

//console.log("shipsel");

			if(map.hasLayer(track)){
				console.log("shiptrack");
				d = Object.values(track._layers)[0]._latlngs[0];

				if(typeof vehiclePositionOld == 'undefined'){
					if(d['lng'] != 'undefined'){
						vehiclePositionOld=[d['lng'], d['lat']];
					}
					else{
						vehiclePositionOld=[c[0], c[1]];
					}
				}
				track.addData({
					"type":"LineString",
					"properties":{
						"timestamp": Date.now()/1000,
						"altitude": 0
					},
					"coordinates":[
						[c[0], c[1]],
						vehiclePositionOld
					]
				});
				vehiclePositionOld=c;
			}
		}
		return oldLayer;
	}

}).addTo(map);

/*******************************/
/********MLAT MESH**************/
/*******************************/
meshLayer = L.realtime(function(success, error) {
	fetch('https://adsb.chaos-consulting.de/alpha/data/mesh.json')
	.then(function(response) { return response.json(); })
	.then(function(dataIn) {
		//console.log(dataIn);
		var dataOut = {
			type: 'FeatureCollection',
			features: []
		}
		Object.entries(dataIn).forEach(

			function(f){
				//console.log(f);
				//Push the plane to GeoJson
				var splitter = f[0].split("-");
				if(filterStation=='all' || splitter[0]==filterStation || splitter[1]==filterStation ){
					dataOut.features.push({
						"geometry": {
							"type": "LineString",
							"coordinates": [[f[1]['start']['lon'], f[1]['start']['lat']],[f[1]['end']['lon'], f[1]['end']['lat']]]
						},
						"type": "Feature",
						"properties": {
							"id":f[0],
							"syncs":f[1]['syncs']
						}
					})
				}
			}
		)
		//console.log(dataOut);
		success(dataOut);
	})
}, {
	//Ever so often
	interval: 1 * 1000,
	style:function(feature) {
		if(feature.properties.syncs < 5){
			return {color: 'red'}
		}else if(feature.properties.syncs < 10){
			return {color: 'orange'}
		}else if(feature.properties.syncs < 15){
			return {color: 'yellow'}
		}else if(feature.properties.syncs > 15){
			return {color: 'green'}
		}
	}/*,
	updateFeature: function(feature) {
		bindPopup("hallo");
	}*/
})/*.bindPopup('h')*/;

/*meshLayer.on('update', function(e){
	bindFeaturePopup = function(fId){
		realtime.getLayer(fId).bindPopup('hhh');
	},
        updateFeaturePopup = function(fId) {
            realtime.getLayer(fId).getPopup().setContent('xxx');
        }
});*/
var scale = L.control.scale().addTo(map);



//When the map loads do stuff to fix tiles and tracks not showing
map.on("load",function() {
	setTimeout(() => {
		map.invalidateSize();
	}, 1);
});

//Center the Map
map.setView([51.505, 7.09], 5);

//Get Planeid from url
var id = getUrlVars()["plane"];
var urlship = getUrlVars()["ship"];
var station = getUrlVars()["station"];
if(typeof id !== 'undefined') {
	planeSelect(id, true, 9);
}
else if(typeof urlship !== 'undefined'){
		shipSelect(urlship, true, 13);
}
else if(typeof station !== 'undefined'){
	map.setZoom(10);
	stationSelect(station, true);
}
else{
	//planeListShow();
	sidebarPanelShow('planeList');
}


stationLayerAdd();
airportLayerAdd();
filterInit();




//Ende vom Init

/****************************************/
/*****************Show*******************/
/****************************************/

//showPlaneHistoryList
function planeHistoryListShow() {
	//clearSidebar();
	document.getElementById("planeHistoryListShow").className = 'buttonWait';
	planesHistoryTableData = [];
	//document.getElementById("planeHistoryListContent").style = "display:block";
	fetch(urlHistory)
		.then(response => response.json())
		.then(data => planesHistoryTableDataMangle(data))
		.catch(err => console.log(err));

	function planesHistoryTableDataMangle(data){
		Object.entries(data).forEach(function blalaberfasel(fk){
			planesHistoryTableData.push({
				'hex': fk[0],
				'flight': fk[1]['flight'],
				'seen': fk[1]['seen']
			});
		});
		planesHistoryTable.replaceData(planesHistoryTableData);

		document.getElementById("planeHistoryListShow").className = 'buttonActive';
	};
}

//Get vars from url
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}


function menueToggle(){
	if(document.getElementById("menue").style != 'display:grid !important'){
		menueShow();
	}
	else{
		menueHide();
	}
}

function menueShow(){
	document.getElementById("menue").style = 'display:grid !important';
	document.getElementById("mobileClose").style = 'display:block';
}

function menueHide(){
	document.getElementById("menue").style = 'display:none';
}

//stations
function stationData(){
	var temp = [];
	fetch(urlBase + '/data/station.json')
		.then(response => response.json())
		.then(data => stationLayerMangle(data))
		.catch(err => console.log(err));
		function stationLayerMangle(data) {
			Object.entries(data).forEach(function xyz(i){
				temp.push(i[1]);
			});
			stationTable.replaceData(temp);
		}
}
