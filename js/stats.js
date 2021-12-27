/*Stats*/
function statsCalc(){

	var liveStats = new Object();
	globalThis.liveStats;

	//Fix
	liveStats.fix = new Object();
	liveStats.fix.all = new Object();
	liveStats.fix.true = new Object();
	liveStats.fix.false = new Object();
	liveStats.fix.mlat = new Object();
	liveStats.fix.all.adsb=0;
	liveStats.fix.mlat.adsb=0;
	liveStats.fix.true.adsb=0;
	liveStats.fix.false.adsb=0;
	liveStats.fix.all.ais=0;
	liveStats.fix.mlat.ais=0;
	liveStats.fix.true.ais=0;
	liveStats.fix.false.ais=0;
	var statsPositionsData = [];

	//Types
	liveStats.types = new Object();
	liveStats.types.adsb = new Object();
	liveStats.types.adsb.none=0;
	liveStats.types.ais = new Object();
	liveStats.types.ais.none=0;
	var statsTypesData = [];

	//Models
	liveStats.models = new Object();
	liveStats.airlines = new Object();

	//Stations
	liveStats.stations = new Object();
	liveStats.stations.online=0;
	liveStats.stations.adsb=0;
	liveStats.stations.mlat=0;
	liveStats.stations.ais=0;


	//ADSB
	Object.values(aircrafts).forEach(function(aircraft) {
		liveStats.fix.all.adsb++;
		if(typeof aircraft.lat !== "undefined") {
			if('mlat' in aircraft){
				liveStats.fix.mlat.adsb++;
			}
			else{
				liveStats.fix.true.adsb++;
			}
		}
		else{
			liveStats.fix.false.adsb++;
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
			if(aircraft.type in liveStats.types.adsb){
				liveStats.types.adsb[aircraft.type]++;
			}
			else{
				liveStats.types.adsb[aircraft.type]=1;
			}
		}
		else{
			liveStats.types.adsb.none++;
		}
	});

	//AIS
	Object.values(ships).forEach(function(ship) {
		liveStats.fix.all.ais++;
		if(ship.lat !== "Undefined" && ship.lat != "91"){
			liveStats.fix.true.ais++;
		}
		else{
			liveStats.fix.false.ais++;
		}
		if(typeof ship.type !== 'undefined'){
			if(ship.type in liveStats.types.ais){
				liveStats.types.ais[ship.type]++;
			}
			else{
				liveStats.types.ais[ship.type]=1;
			}
		}
		else{
			liveStats.types.ais.none++;
		}
	});

	//Stations
	fetch(urlBase + '/data/station.json')
		.then(response => response.json())
		.then(data => stationMangle(data))
		.catch(err => console.log(err));

	function stationMangle(data) {
		//Hier statt der Schleife mal was verbessern als assoc mit Object.entries
		Object.values(data).forEach(function aircrafts(s){
			if(typeof s.seen !== 'undefined'){
				if(s.seen == 'now'){
					liveStats.stations.online++;
				}
				if(s.planes > 0){
					liveStats.stations.adsb++;
				}
				if(s.ships > 0){
					liveStats.stations.ais++;
				}
			}
		});
		var statsStationsData = [];
		console.log('push');
		statsStationsData.push({"online":liveStats.stations.online, "adsb":liveStats.stations.adsb, "mlat":liveStats.stations.mlat, "ais":liveStats.stations.ais});
		statsStationsTable.replaceData(statsStationsData);
	}

	//Ausgabe
	//Fix
	var ff = new Object();
	Object.entries(liveStats.fix).forEach(function(type){
		Object.entries(type[1]).forEach(function(f){
			if(!(type[0] in ff)){
				ff[type[0]] = new Object();
			}
			ff[type[0]][f[0]]=f[1];
		});
	});

	Object.entries(ff).forEach(function(type){
		var ffx = new Object();
		ffx.pos=fixToIcon(type[0]);
		Object.entries(type[1]).forEach(function(x){
			ffx[x[0]]=x[1];
		});
		statsPositionsData.push(ffx);
	});

	statsPositionsTable.replaceData(statsPositionsData);

	//Types
	var temp = new Object();
	Object.entries(liveStats.types).forEach(function(type){
		Object.entries(type[1]).forEach(function(t){
			if(!(t[0] in temp)){
				temp[t[0]] = new Object();
			}
			temp[t[0]][type[0]]=t[1];
		});
	});

	Object.entries(temp).forEach(function(type){
		var tempx = new Object();
		tempx.type=type[0];
		tempx.typeLong=typeToLong(type[0]);
		Object.entries(type[1]).forEach(function(x){
			tempx[x[0]]=x[1];
		});
		statsTypesData.push(tempx);
	});

	statsTypesTable.replaceData(statsTypesData);

	//Models
	var statsModelsData = [];
	Object.entries(liveStats.models).forEach(function(model){
		statsModelsData.push({"model":model[0], "count":model[1], "rel":model[1]/liveStats.fix.all.adsb*100});
	});
	statsModelsTable.replaceData(statsModelsData);

	//Airlines
	var statsAirlinesData = [];
	Object.entries(liveStats.airlines).forEach(function(airline){
		statsAirlinesData.push({"airline":airline[0], "count":airline[1], "rel":airline[1]/liveStats.fix.all.adsb*100});
	});
	statsAirlinesTable.replaceData(statsAirlinesData);




}

