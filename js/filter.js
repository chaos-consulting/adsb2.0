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
	//statsCalc();
};

function filterTypeSet(t){
	document.getElementById("filterType" + ucFirst(filterType)).className = 'filter';
	document.getElementById("filterType" + ucFirst(t)).className = 'filterActive';
	filterType = t;
}

function filterFixSet(t){
	document.getElementById("filterFix" + ucFirst(filterFix)).className = 'filter';
	document.getElementById("filterFix" + ucFirst(t)).className = 'filterActive';
	filterFix = t;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
}

function filterStationSet(s){
	document.getElementById("filterStation" + ucFirst(filterStation)).className = 'filter';
	document.getElementById("filterStation" + ucFirst(s)).className = 'filterActive';
	filterStation = s;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
}

function filterAltitudeSet(a){
	document.getElementById("filterAltitude" + filterAltitude).className = 'filterAltitude';
	document.getElementById("filterAltitude" + a).className = 'filterAltitudeActive';
	filterAltitude = a;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
}

/*function filterModelSet(m){
	document.getElementById("filterStation" + ucFirst(filterModel)).className = 'filter';
	document.getElementById("filterStation" + ucFirst(m)).className = 'filterActive';
	filterModel = m;
}*/

function filterSourceSet(s){
	document.getElementById("filterSource" + ucFirst(filterSource)).className = 'filter';
	document.getElementById("filterSource" + ucFirst(s)).className = 'filterActive';
	filterSource = s;
	if(heatmapLayerActive){
		heatmapLayerRemove();
		heatmapLayerAdd();
	}
}

function filterSelectedSet(m){
	document.getElementById("filterSelected" + ucFirst(filterSelected)).className = 'filter';
	document.getElementById("filterSelected" + ucFirst(m)).className = 'filterActive';
	filterSelected = m;
}
