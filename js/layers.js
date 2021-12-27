function layerToggle(layer, button){
	if(!map.hasLayer(layer)){
		layerOn(layer, button);
	}
	else{
		//planeLayerOff();
		layerOff(layer, button);
	}
}

function layerOn(layer, button){
	map.addLayer(layer);
	var ele = layer;
	//element += "Toggle";
	console.log('ele');
	console.log(button);
	document.getElementById(button).className = 'buttonActive';
}

function layerOff(layer, button){
	map.removeLayer(layer);
	document.getElementById(button).className = 'button';
}

//Airports
function airportLayerAdd() {
	document.getElementById("airportLayerToggle").className = 'buttonWait';
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
