/****************************************/
/************Helper functions************/
/****************************************/
//typeToColor
function typeToColor(alt, type){
	if(type == 'bos'){
		return '#f00';
	}else if(type == 'mil'){
		return '#0f0';
	}else if(type == 'int'){
		return '#ff00c3';
	}else if(type == 'his'){
		return '#00000000';
	}else{
		return altitudeToColor(alt);
	}
}

//altitudeToColor
function altitudeToColor(alt){
	//https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than
	if(alt <= 0){
		return '#aaa';
	}else if(alt <= 1000){
		return '#a52a2a';
	}else if(alt <= 2000){
		return '#d97012';
	}else if(alt <= 3000){
		return '#ffa500';
	}else if(alt <= 4500){
		return '#ffcc00';
	}else if(alt <= 6000){
		return '#ff0';
	}else if(alt <= 7500){
		return '#afda21';
	}else if(alt <= 9000){
		return '#45a94d';
	}else if(alt <= 10500){
		return '#51b67b';
	}else if(alt <= 12000){
		return '#61c7b8';
	}else if(alt <= 13500){
		return '#4dacd6';
	}else if(alt == 'ground'){
		return '#aaa';
	}else
	return '#3388ff';
}

//
function fixToIcon(f){
	var fix="<i class='fas fa-times-circle' title='None - no position available'></i>";
	if(f === 'true'){
		fix="<i class='fas fa-check-circle' title='Fix - aircraft position received'></i>";
	}
	if(f === 'mlat'){
		fix="<i class='fas fa-compass' title='MLAT - approximate aircraft position calculated via MLAT'></i>";
	}
	return fix;
}

//
function ftToM(ft){
	return Math.round(ft/3.28269)
}

function mToKm(m){
	return Math.round(m*1.609)
}

function ktToKmh(kt){
	return Math.round(kt*1.85106)
}

function typeToLong(type){
	if(type == 'mil'){
		return 'military';
	}else if(type == 'int'){
		return 'interesting';
	}else if(type == 'bos'){
		return 'police and rescue';
	}else
	return 'unknown';
}

//planeIcon
function planeIcon(feature){

		//vars
		var model = feature.properties.model;
		var category = feature.properties.category

		//Check for 
		if(model in markers['models']){
			var path = markers['models'][model]['path'];
			var size = markers['models'][model]['size'];
			var resize = markers['models'][model]['resize'];
		}
		else{
			if(category in markers['categorys']){
				var path = markers['categorys'][category]['path'];
				var size = markers['categorys'][category]['size'];
				var resize = markers['categorys'][category]['resize'];
			}
			else{
				var path = markers['models']['default']['path'];
				var size = markers['models']['default']['size'];
				var resize = markers['models']['default']['resize'];
			}
		}

	return L.icon({
		className: 'planeMarker',
		iconUrl: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" transform="scale(0.95) rotate(' + feature.properties.track + ')"><path stroke="#000" stroke-width="1" fill="' + typeToColor(feature.properties.altitude, feature.properties.type) + '" opacity="' + feature.properties.opacity + '" d="' + path + '"/>Sorry, your browser does not support inline SVG.</svg>'),
		iconSize: size
	});
}

function ucFirst(str) {
	if (!str) return str;
	return str[0].toUpperCase() + str.slice(1);
}
