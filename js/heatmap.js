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
	document.getElementById("activityIndicator").style.display = 'block';
	heatmapLayerActive=true;
	var radius = 75;
	if(filterSource=='ais'){
		radius = 25;
	}
	heatmapLayer = L.heatLayer([[0,0,0]],{
		radius: radius,
		maxZoom: 17,
		max: 1,
	}).addTo(map);
	var fs='';
	if(filterStation!='all'){
		fs = filterStation;
	}
	fetch(urlBase + '/data/heatmap.php?name=' + fs + '&alt=' + filterAltitude + '&fix=' + filterFix + '&source=' + filterSource)
		.then(response => response.json())
		.then(data => heatmapMangle(data))
		.catch(err => console.log(err));

	function heatmapMangle(data) {
		Object.entries(data).forEach(function xy(i){
			heatmapLayer.addLatLng([i[1].lat,i[1].lon]);
		});
		document.getElementById("heatmapLayerToggle").className = 'buttonActive';
		document.getElementById("activityIndicator").style.display = 'none';
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
