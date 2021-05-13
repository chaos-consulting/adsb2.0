//Tabulator Planelist
var table = new Tabulator("#planelist", {
	layout:"fitDataFill",
	placeholder:"No Data Set",
	height:"100%",
	rowClick:function(e, row){
		planeSelect(row["_row"]["data"]["hex"]);
	},
	rowFormatter:function(row){
			row.getElement().classList.add("listType_" + row["_row"]["data"]["type"]);
		},
	initialSort:[
		{column:"flight",dir:"asc"}
	],
	columns:[
		{title:"Hex", field:"hex", sorter:"string"},
		{title:"Flight", field:"flight", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }},
		{title:"Altitude", field:"altitude", sorter:"number", sorterParams: { alignEmptyValues:"bottom", thousandSeparator:".", decimalSeparator:"," }},
		{title:"Speed", field:"speed", sorter:"number"},
		{title:"Heading", field:"track", sorter:"number"},
	],
});

//Tabulator PlaneHistoryList
var planesHistoryTable = new Tabulator("#planeHistoryList", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	height:"100%",
	rowClick:function(e, row){
		planeSelect(row["_row"]["data"]["hex"], true);
	},
	initialSort:[
		{column:"flight",dir:"asc"}
	],
	columns:[
		{title:"Hex", field:"hex", sorter:"string"},
		{title:"Flight", field:"flight", sorter:"string", sorterParams: { alignEmptyValues:"bottom" }},
		{title:"Seen", field:"seen", sorter:"string"},
	],
});

//Tabulator stationlist
var stationTable = new Tabulator("#stationlist", {
	layout:"fitDataFill",
	placeholder:"No Data Set",
	height:"100%",
	//ajaxURL:"data/station.json",
	rowClick:function(e, row){
		stationSelect(row["_row"]["data"]["name"]);
	},
	initialSort:[
		{column:"name",dir:"asc"}
	],
	columns:[
		{title:"Station", field:"name", sorter:"string", width:180},
		{title:"<i class='fas fa-plane'></i>", field:"planes", sorter:"number"},
		{title:"<i class='fas fa-map-pin'></i>", field:"positions", sorter:"number"},
		{title:"<i class='fas fa-clock'></i>", field:"seen", sorter:"string"},
	],
});

//Tabulator planeStations
var planeStationsTable = new Tabulator("#planeStations", {
	layout:"fitColumns",
	height:"500px",
	placeholder:"No Data Set",
	//Only a fixed height allows the surrounding div to be set to overflow auto/scroll without sideeffects
	rowClick:function(e, row){
		stationSelect(row["_row"]["data"]["name"]);
	},
	initialSort:[
		{column:"name",dir:"asc"}
	],
	columns:[
		{title:"Station", field:"name", sorter:"string", width:200},
		{title:"<i class='fas fa-ruler'></i>", field:"dist", sorter:"number"},
		{title:"<i class='fas fa-signal'></i>", field:"rssi", sorter:"number"},
		{title:"<i class='fas fa-map-pin'></i>", field:"fix", sorter:"string",formatter:"html", width:10},
	],
});

//Tabulator stationMlatPeersTable
var stationMlatPeersTable = new Tabulator("#stationMlatPeersTable", {
	layout:"fitColumns",
	placeholder:"No Data Set",
	rowClick:function(e, row){
		stationSelect(row["_row"]["data"]["name"]);
	},
	initialSort:[
		{column:"name",dir:"asc"}
	],
	columns:[
		{title:"MLAT sync peer", field:"name", sorter:"string", width:200},
		{title:"<i class='fas fa-sync-alt' title='Number of syncs (higher is better)'></i>", field:"syncs", sorter:"number"},
		{title:"<i class='fas fa-stopwatch' title='Sync time offset (lower is better)'></i>", field:"syncErr", sorter:"number"},
		{title:"<i class='fas fa-wave-square' title='Sync frequency offset (closer to 0 is better)'></i>", field:"syncOffset", sorter:"number"},
	],
});

//Tabulator stats fixes
var statsPositionsTable = new Tabulator("#statsPositionsTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	/*height:"133px",*/
	initialSort:[
		{column:"flight",dir:"asc"}
	],
	columns:[
		{title:"Fix", field:"pos", formatter:"html", sorter:"string"},
		{title:"<i class='fas fa-calculator'></i>", field:"count", sorter:"number"},
		{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}
		}
	],
});

//Tabulator stats types
var statsTypesTable = new Tabulator("#statsTypesTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	rowFormatter:function(row){
		row.getElement().classList.add("listType_" + row["_row"]["data"]["type"]);
	},
	initialSort:[
		{column:"Type",dir:"asc"}
	],
	columns:[
		{title:"TS", field:"type", visible:false, sorter:"string"},
		{title:"Type", field:"typeLong", sorter:"string"},
		{title:"<i class='fas fa-calculator'></i>", field:"count", sorter:"number"},
		{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}
		}
	],
});

//Tabulator stats models
var statsModelsTable = new Tabulator("#statsModelsTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	initialSort:[
		{column:"count",dir:"desc"}
	],
	columns:[
		{title:"Model", field:"model", sorter:"string"},
		{title:"<i class='fas fa-calculator'></i>", field:"count", sorter:"number"},
		{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}
		}
	],
});

//Tabulator stats airlines
var statsAirlinesTable = new Tabulator("#statsAirlinesTable", {
	layout:"fitDataStretch",
	placeholder:"Loading...",
	initialSort:[
		{column:"count",dir:"desc"}
	],
	columns:[
		{title:"Airline", field:"airline", sorter:"string"},
		{title:"<i class='fas fa-calculator'></i>", field:"count", sorter:"number"},
		{title:"<i class='fas fa-chart-bar'></i>", field:"rel", formatter:"progress", formatterParams:{
			min:0,
			max:100,
			color: "#2b72d7"
		}
		}
	],
});
