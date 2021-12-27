//Station stuff
//stationSelect
function stationSelect(name, focus=false) {
	clearSidebar();
	removeTrack();
	stationMlatPeersTableData =[];
	sidebarShow();
	stationSelected = name;
	/*if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}*/
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
				if(typeof s.mlat !== 'undefined'){
					document.getElementById("stationMlats").innerHTML = s.mlat;
				}
				else{
					document.getElementById("stationMlats").innerHTML = 'n/a';
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
				if(typeof s.lat !== 'undefined' && typeof s.lon !== 'undefined' && focus==true){
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
	sidebarPanelShow('planeList');
	/*if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}heatmapLayerRemove();*/
	window.history.pushState("","","?");
}

//Station Layer
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
}
