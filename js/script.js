/****************************************/
/************Initial stuff***************/
/****************************************/

/****************************************/
/***************Variables****************/
/****************************************/
//Basedir
var urlBase = 'https://adsb.chaos-consulting.de/beta';
var urlHistory = urlBase + '/data/planesHistory.json';

//Map
var map = L.map('map',{
	zoomControl: false
	}).setActiveArea({
		position: 'absolute',
		top: '0px',
		left: '0px',
		right: '400px',
		bottom: '0px'
});

//aircrafts
var aircrafts;

//Stations
var stationLayer;
var stationLayerActive = true;
var stationSelected;
var stationMlatPeersTableData =[];

//Airports
var airportLayer;
var airportLayerActive=true;

//Heatmap
var heatmapLayer;
var heatmapLayerActive = false;

//Plane
//Speed&Altitude
var planeSpeedOld;
var planeAltitudeOld;
var planeDirectionOld;
var planePositionOld;

//Track
var track; //rename -> planeTrackHistory

//History ghostmarker
var planeGhostMarker;

//Crosshairs tracking
var planeInFocus = false;

//Tables
var planesHistoryTableData =[];

//Sidebar
var sidebar = true;

//Filters
var filterType = 'all';
var filterStation = 'all';
var filterAltitude = 999999;
var filterModel = 'all';

//magic
var magic = false;
var magicTime = 0;

//Notifications
var notifyState = false;
var notifyCache = [];
var notifySound = false;

//mobile
var mobile = false;

//Leaflet map
map.attributionControl.setPosition('bottomleft');

//Realtime layer for planes
realtime = L.realtime(function(success, error) {
	fetch('https://adsb.chaos-consulting.de/beta/data/aircraft.json')
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

				if(include == true){
				//planesTableData
				tableData.push({
					'hex': f.hex,
					'flight': f.flight,
					'altitude': ftToM(f.altitude),
					'speed': ktToKmh(f.speed),
					'track': f.track,
					'type': f.type
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
					//if(!(f.hex in notifyCache)){
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
					if(planeInFocus){
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
					planeFocusOn();
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
			icon: planeIcon(feature)
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

		if(feature.properties.id == id) {
			if(typeof planeGhostMarker !== 'undefined') {
				planeGhostMarker.remove();
			}

			if(map.hasLayer(track)){
				d = Object.values(track._layers)[0]._latlngs[0];

				if(typeof planePositionOld == 'undefined'){
					planePositionOld=[d['lng'], d['lat']];
				}
				track.addData({
					"type":"LineString",
					"properties":{
						"timestamp": Date.now()/1000,
						"altitude": feature.properties.altitude
					},
					"coordinates":[
						[c[0], c[1]],
						planePositionOld
					]
				});
				planePositionOld=c;
			}
		}
		return oldLayer;
	}

}).addTo(map);



//Maptiles
L.tileLayer('https://tiles.chaos-consulting.de/b.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);

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
var station = getUrlVars()["station"];
if(typeof id !== 'undefined') {
	planeSelect(id, true);
}
else if(typeof station !== 'undefined'){
	map.setZoom(10);
	stationSelect(station);
}
else{
	planeListShow();
}

stationLayerAdd();
airportLayerAdd();
filterInit();

//Ende vom Init

/****************************************/
/***************Sidebar******************/
/****************************************/
//sidebarToggle
function sidebarToggle() {
	if(!sidebar){
		sidebarShow();
	}
	else{
		sidebarHide();
	}
}

//sidebarShow
function sidebarShow() {
	if(!sidebar){
		document.getElementById("sidebar").className = 'sidebar';
		document.getElementById("sidebarToggle").innerHTML = '<i class="fas fa-angle-double-right"></i>';
		document.getElementById("tabbar").className = 'tabbar desktop';
		sidebar=true;
		map.setActiveArea({
			position: 'absolute',
			top: '0px',
			left: '0px',
			right: '400px',
			bottom: '0px'
		});
	}
}

//sidebarHide
function sidebarHide() {
	if(sidebar){
		document.getElementById("sidebar").className = 'sidebarHidden';
		document.getElementById("sidebarToggle").innerHTML = '<i class="fas fa-angle-double-left"></i>';
		document.getElementById("tabbar").className = 'tabbarRight desktop';
		sidebar=false;
		map.setActiveArea({
			position: 'absolute',
			top: '0px',
			left: '0px',
			right: '50px',
			bottom: '0px'
		});
	}
}

//clearSidebar
//Inwoke before every sidebar panel change
function clearSidebar() {

	//Stop tracking a plane
	planeFocusOff();

	//Tabbed sidebar panels
	var panels=["planeList", "planeHistoryList", "stationList", "stats", "faq", "filter", "notify"];
	panels.forEach(panelHide);
	function panelHide(i){
		document.getElementById(i + "Content").style = "display:none";
		document.getElementById(i + "Show").className = 'button';
	}

	//Tabless panels
	//plane
	document.getElementById("planeContent").style = "display:none";

	//station
	document.getElementById("stationContent").style = "display:none";

	//stationDeSelect
	stationSelected = '';
	heatmapLayerRemove();
	sidebarShow();
	menueHide();
}

/****************************************/
/**********Sidebar helper functions******/
/****************************************/
//tableCollapseToggle
function tableCollapseToggle(id){
	if(document.getElementById(id + 'Body').style.display == "none"){
		document.getElementById(id + 'Body').style.display = "";
		document.getElementById(id + 'Toggle').className = "fas fa-minus-square";
	}
	else{
		document.getElementById(id + 'Body').style.display = "none";
		document.getElementById(id + 'Toggle').className = "fas fa-plus-square";
	}
}

/****************************************/
/**********Sidebar Content Functions*****/
/****************************************/

/****************************************/
/*****************Show*******************/
/****************************************/
//planeListShow
function planeListShow() {
	clearSidebar();
	document.getElementById("planeListContent").style = "display:block";
	document.getElementById("planeListShow").className = 'buttonActive';
}

//showPlaneHistoryList
function planeHistoryListShow() {
	clearSidebar();
	document.getElementById("planeHistoryListShow").className = 'buttonWait';
	planesHistoryTableData = [];
	document.getElementById("planeHistoryListContent").style = "display:block";
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

//ShowStationList
function stationListShow() {
	clearSidebar();
	document.getElementById("stationListContent").style = "display:block";
	document.getElementById("stationListShow").className = 'buttonActive';
}

//statsShow
function statsShow() {
	clearSidebar();
	document.getElementById("statsContent").style = "display:block";
	document.getElementById("statsShow").className = 'buttonActive';
	statsCalc();
}

//faqShow
function faqShow() {
	clearSidebar();
	document.getElementById("faqContent").style = "display:block";
	document.getElementById("faqShow").className = 'buttonActive';
}

//notifyShow
function notifyShow() {
	clearSidebar();
	document.getElementById("notifyContent").style = "display:block";
	document.getElementById("notifyShow").className = 'buttonActive';
}

/****************************************/
/**************Plane stuff***************/
/****************************************/
//planeSelect
function planeSelect(pid, focus=false) {
	id=pid;
	planeDeSelect();
	clearSidebar();
	document.getElementById("planeContent").style = "display:block";
	sidebarShow();
	planeSpeedOld;
	window.history.pushState("","","?plane=" + id);
	//history
	cellRefresh("planeId", id);
	var plane;
	fetch(urlBase + '/data/planeHistory.php?plane=' + id)
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		plane = data;
		if(data.timestamp != null){
			planeInfoRefresh(data);
			if(focus){
				planeFocusOn();
			}
		}
		else{
			//problem
			//planeDeSelect();
		}
	});

	//Load history from server
	fetch(urlBase + '/track/?plane=' + id)
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		//If there is a position in it add it to the map
		if(data.status != 'noDataAvailable'){
			if(typeof Object.entries(data)[1][1][0] !== 'undefined' ){
				if(Object.entries(data)[1][1][0]["coordinates"][0]){
					globalThis.track = L.geoJSON(data, {
						style: function(feature) {
							return {
								color: altitudeToColor(feature.geometry.properties.altitude),
								dashArray: feature.geometry.properties.dashArray
							};
						},
						onEachFeature: function (feature, layer){
							layer.bindTooltip(new Date(Math.floor(feature.properties.timestamp)*1000) + "<br>Altitude: " + Math.round(feature.properties.altitude/3.28269) + "m / " + feature.properties.altitude + "ft");
						}
					}).addTo(map);
				}
			}
		}
		else{
			//Wenn der Server nix liefert ist hier kaputt
		}
	}).then(function() {
		//History stuff for a non live plane
		if(!(id in aircrafts)){
			d = Object.values(track._layers)[0]._latlngs[0];
			var fakeFeature = { properties: { model: plane.model, track: 0, opacity: 1, type: "his" }};
			planeGhostMarker = L.marker(d, {
				icon: planeIcon(fakeFeature)
			}).addTo(track);
		}
	});
}

//planeDeSelect
function planeDeSelect() {
	planeSpeedOld;
	planePositionOld=undefined;
	planeAltitudeOld;
	planeDirectionOld;
	planeListShow();
	removeTrack();
	window.history.pushState("","","?");
}

//Focus tracking plane
//planeFocusToggle
function planeFocusToggle() {
	if(!planeInFocus){
		planeFocusOn();
	}
	else{
		planeFocusOff();
	}
}

//planeFocusOn
function planeFocusOn(){
	planeInFocus = true;
	document.getElementById("planeFocus").style = "color:#0f0;"
}

//planeFocusOff
function planeFocusOff(){
	planeInFocus = false;
	document.getElementById("planeFocus").style = "color:white;"
}

//removeTrack
function removeTrack(){
	if(map.hasLayer(track)) {
		map.removeLayer(track);
	}
}

//Station stuff
//stationSelect
function stationSelect(name) {
	clearSidebar();
	stationMlatPeersTableData =[];
	sidebarShow();
	heatmapLayerRemove();
	stationSelected = name;
	document.getElementById("stationContent").style = "display:block";
	document.getElementById("stationName").innerHTML = name;
	window.history.pushState("","","?station=" + name);
	fetch(urlBase + '/data/station.json')
		.then(response => response.json())
		.then(data => stationMangle(data))
		.catch(err => console.log(err));

	function stationMangle(data) {
		/*Hier statt der Schleife mal was verbessern als assoc mit Object.entries*/
		Object.values(data).forEach(function aircrafts(s){

			//
			if(name === s.name){

				//Info
				if(typeof s.planes !== 'undefined'){
					document.getElementById("stationPlanes").innerHTML = s.planes;
				}
				else{
					document.getElementById("stationPlanes").innerHTML = 'n/a';
				}
				if(typeof s.positions !== 'undefined'){
					document.getElementById("stationPositions").innerHTML = s.positions;
				}
				else{
					document.getElementById("stationPositions").innerHTML = 'n/a';
				}
				if(typeof s.seen !== 'undefined'){
					if(s.seen < 10){
						document.getElementById("stationSeen").innerHTML = 'now';
					}
					else{
						document.getElementById("stationSeen").innerHTML = s.seen;
					}
				}
				else{
					document.getElementById("stationSeen").innerHTML = 'n/a';
				}
				document.getElementById("stationLink").innerHTML = '<a href="?station=' + name + '">' + urlBase + '/?station=' + name + '</a>';
				//locate
				if(typeof s.lat !== 'undefined' && typeof s.lon !== 'undefined'){
					map.setZoom(15);
					map.panTo([s.lat, s.lon]);
				}

				//Sync geraffel
				Object.entries(s.peers).forEach(function x(y){
					stationMlatPeersTableData.push({
						'name': y[0],
						'syncs': y[1][0],
						'syncErr': y[1][1],
						'syncOffset': y[1][2]
					});
				})
				stationMlatPeersTable.replaceData(stationMlatPeersTableData);
			}
		});
	}
}

//stationDeSelect
function stationDeSelect(){
	stationSelected = '';
	planeListShow();
	heatmapLayerRemove();
	window.history.pushState("","","?");
}

//Station Layer
//stationLayerToggle
function stationLayerToggle(){
	if(stationLayerActive){
		stationLayerRemove();
	}
	else{
		stationLayerAdd();
	}
}

//stationLayerAdd
function stationLayerAdd(){
	document.getElementById("stationLayerToggle").className = 'buttonWait';
	stationLayer = L.layerGroup();
	fetch(urlBase + '/data/station.json')
		.then(response => response.json())
		.then(data => stationLayerMangle(data))
		.catch(err => console.log(err));

		function stationLayerMangle(data) {
			Object.entries(data).forEach(function xyz(i){
				if(typeof i[1].lat !== "undefined") {
					var lat = i[1].lat;
					var lon = i[1].lon;
					var mn = i[1].name;
					//Generate station markers via div
					var mark = L.marker([lat,lon], {
						icon: L.divIcon({
							className: 'stationMarker',
							html:'<i onclick="stationSelect(\'' + mn + '\')" class="fas fa-broadcast-tower"></i>',
							iconSize: [32, 32]
						}),
						title: mn,
						zIndexOffset: -1000,
					});
					mark.addTo(stationLayer);
				}
			});
			document.getElementById("stationLayerToggle").className = 'buttonActive';
		}
		stationLayer.addTo(map)
		stationLayerActive=true;
}

//stationLayerRemove
function stationLayerRemove(){
	stationLayer.remove();
	stationLayerActive=false;
	document.getElementById("stationLayerToggle").className = 'button';
}

//Heatmap
//heatmapLayerToggle
function heatmapLayerToggle(){
	if(!heatmapLayerActive){
		heatmapLayerAdd();
	}
	else{
		heatmapLayerRemove();
	}
}

//heatmapLayerAdd
function heatmapLayerAdd(){
	document.getElementById("heatmapLayerToggle").className = 'buttonWait';
	heatmapLayerActive=true;
	heatmapLayer = L.heatLayer([[0,0,0]],{
			radius: 75,
			maxZoom: 17,
			max: 1,
		}).addTo(map);
	fetch(urlBase + '/data/heatmap.php?name=' + stationSelected)
		.then(response => response.json())
		.then(data => heatmapMangle(data))
		.catch(err => console.log(err));

	function heatmapMangle(data) {
		Object.entries(data).forEach(function xy(i){
			heatmapLayer.addLatLng([i[1].lat,i[1].lon]);
		});
		document.getElementById("heatmapLayerToggle").className = 'buttonActive';
	}
}

//heatmapLayerRemove
function heatmapLayerRemove(){
	document.getElementById("heatmapLayerToggle").className = 'button';
	if(heatmapLayerActive){
		heatmapLayerActive=false;
		heatmapLayer.remove();
	}
}

//filter
function filterInit(){
	//Station Filter
	document.getElementById("filterStationList").innerHTML = '<div id="filterStationAll" class="filterActive" onclick="filterStationSet(\'all\')">All</div>';
	fetch(urlBase + '/data/station.json')
	.then(response => response.json())
	.then(data => stfu(data))
	.catch(err => console.log(err));

	function stfu(data) {
		Object.values(data).forEach(function acs(s){
			if(s.positions > 0){
				document.getElementById("filterStationList").innerHTML += '<div id="filterStation' + s.name + '" onclick="filterStationSet(\'' + s.name + '\')">' + s.name + '</div>';
			}
		})
	}

	//Altitude
	var alts = [1, 1000, 2000, 3000, 4500, 6000, 7500, 9000, 10500, 12000, 13500];
	alts.forEach(function altinit(a){
		var alt = a - 1;
		
		document.getElementById("filterAltitudeList").innerHTML += '<td style="background-color:' + altitudeToColor(alt) + '" title="0 - ' + a + '" onclick="filterAltitudeSet(\'' + a + '\')" class="filterAltitude" id="filterAltitude' + a + '">X</td>';
	});
	document.getElementById("filterAltitudeList").innerHTML += '<td style="background-color:' + altitudeToColor(13501) + '" title="13.500+" onclick="filterAltitudeSet(999999)" class="filterAltitudeActive" id="filterAltitude999999">x</td>';

	//Airline
/*	Object.entries(liveStats.models).forEach(function(model){
		statsModelsData.push({"model":model[0], "count":model[1], "rel":model[1]/liveStats.total*100});
	});
	statsModelsTable.replaceData(statsModelsData);

	var statsAirlinesData = [];
	Object.entries(liveStats.airlines).forEach(function(airline){
		statsAirlinesData.push({"airline":airline[0], "count":airline[1], "rel":airline[1]/liveStats.total*100});
	});*/
	console.log('lst');
	statsCalc();
	console.log(liveStats.airlines);
};



//filterShow
function filterShow(){
	clearSidebar();
	document.getElementById("filterContent").style.display = 'block'
	document.getElementById("filterShow").className = 'buttonActive';
	//filterInit();
};

//magic
//magicToggle
function magicToggle(){
	if(!magic){
		magicOn();
	}
	else{
		magicOff();
	}
};
function magicOn(){
	document.getElementById("magicToggle").className = 'buttonWait';
		magic=true;
}
function magicOff(){
	document.getElementById("magicToggle").className = 'button';
	magic=false;
}

//Airports
function airportLayerAdd() {
	document.getElementById("airportLayerToggle").className = 'buttonWait';
	airportLayerActive=true;
	fetch(urlBase + '/data/airports.json')
		.then(function(response) {
			return response.json();
	})
	.then(function(data) {
		globalThis.airportLayer = L.geoJSON(data, {
			pointToLayer: function(feature, latlng){
				return L.marker(latlng, {
					icon: L.divIcon({
						className: 'airportMarker',
						html:'<i class="fas fa-plane-departure"></i>',
						iconSize: [32, 32]
					}),
					title: feature.properties.icao + "/" + feature.properties.iata + "\n" + feature.properties.name,
					zIndexOffset: -1000,
				});
			}
		}).addTo(map)
	})
	document.getElementById("airportLayerToggle").className = 'buttonActive';
}
//airportLayerRemove
function airportLayerRemove(){
	airportLayer.remove();
	airportLayerActive=false;
	document.getElementById("airportLayerToggle").className = 'button';
}

//airportLayerToggle
function airportLayerToggle(){
	if(airportLayerActive){
		airportLayerRemove();
	}
	else{
		airportLayerAdd();
	}
}

/*Stats*/
function statsCalc(){

	var liveStats = new Object();
	globalThis.liveStats;
	liveStats.total = 0;
	liveStats.totalMlat = 0;
	liveStats.totalFix = 0;
	liveStats.models = new Object();
	liveStats.airlines = new Object();
	liveStats.types = new Object();
	liveStats.types.none=0;

	Object.values(aircrafts).forEach(function(aircraft) {
		liveStats.total++;
		if(typeof aircraft.lat !== "undefined") {
			if('mlat' in aircraft){
				liveStats.totalMlat++;
			}
			else{
				liveStats.totalFix++;
			}
		}
		if(aircraft.model in liveStats.models) {
			liveStats.models[aircraft.model]++;
		} else {
			liveStats.models[aircraft.model] = 1;
		}
		if(aircraft.airlineShort in liveStats.airlines) {
			liveStats.airlines[aircraft.airlineShort]++;
		} else {
			liveStats.airlines[aircraft.airlineShort] = 1;
		}
		if(typeof aircraft.type !== 'undefined'){
			if(aircraft.type in liveStats.types){
				liveStats.types[aircraft.type]++;
			}
			else{
				liveStats.types[aircraft.type]=1;
			}
		}
		else{
			liveStats.types.none++
		}
	});
	liveStats.totalNoFix = liveStats.total - liveStats.totalFix - liveStats.totalMlat;
	var statsPositionsData = [{"pos":"All", "count":liveStats.total, "rel":0},{"pos":fixToIcon('true'), "count":liveStats.totalFix, "rel": liveStats.totalFix/liveStats.total*100},{"pos":fixToIcon('mlat'),"count":liveStats.totalMlat,"rel":liveStats.totalMlat/liveStats.total*100},{"pos":fixToIcon('false'),"count":liveStats.totalNoFix,"rel":liveStats.totalNoFix/liveStats.total*100}];
	statsPositionsTable.replaceData(statsPositionsData);

	var statsTypesData = [];
	Object.entries(liveStats.types).forEach(function(type){
		statsTypesData.push({"type":type[0], "typeLong":typeToLong(type[0]), "count":type[1], "rel":type[1]/liveStats.total*100});
	});
	statsTypesTable.replaceData(statsTypesData);

	var statsModelsData = [];
	Object.entries(liveStats.models).forEach(function(model){
		statsModelsData.push({"model":model[0], "count":model[1], "rel":model[1]/liveStats.total*100});
	});
	statsModelsTable.replaceData(statsModelsData);

	var statsAirlinesData = [];
	Object.entries(liveStats.airlines).forEach(function(airline){
		statsAirlinesData.push({"airline":airline[0], "count":airline[1], "rel":airline[1]/liveStats.total*100});
	});
	statsAirlinesTable.replaceData(statsAirlinesData);

}

//Get vars from url
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function filterTypeSet(t){
	document.getElementById("filterType" + ucFirst(filterType)).className = 'filter';
	document.getElementById("filterType" + ucFirst(t)).className = 'filterActive';
	filterType = t;
}

function filterStationSet(s){
	document.getElementById("filterStation" + ucFirst(filterStation)).className = 'filter';
	document.getElementById("filterStation" + ucFirst(s)).className = 'filterActive';
	filterStation = s;
}

function filterAltitudeSet(a){
	document.getElementById("filterAltitude" + filterAltitude).className = 'filterAltitude';
	document.getElementById("filterAltitude" + a).className = 'filterAltitudeActive';
	filterAltitude = a;
}

function filterModelSet(m){
	document.getElementById("filterStation" + ucFirst(filterModel)).className = 'filter';
	document.getElementById("filterStation" + ucFirst(m)).className = 'filterActive';
	filterModel = m;
}

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
}

function notifySoundOn(){
	notifySound=true;
}

function notifySoundOff(){
	notifySound=false;
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
