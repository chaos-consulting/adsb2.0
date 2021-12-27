//geolocation
//geolocationToggle
function geolocationToggle(){
	if(!geolocation){
		geolocationOn();
	}
	else{
		geolocationOff();
	}
};
function geolocationOn(){
	document.getElementById("geolocationToggle").className = 'buttonWait';
	map.locate({setView: true, watch: true})
	geolocation=true;
}
function geolocationOff(){
	document.getElementById("geolocationToggle").className = 'button';
	map.stopLocate();
	geolocation=false;
}

//
function onLocationFound(e) {
	document.getElementById("geolocationToggle").className = 'buttonActive';
}
function onLocationError(e) {
	document.getElementById("geolocationToggle").className = 'button';
	alert('Geolocation failed, check your browser settings');
}

//
//GeolocatinoError->
map.on('locationerror', onLocationError);

//GeolocationSuccess->
map.on('locationfound', onLocationFound);
