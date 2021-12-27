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
	vehicleFocusOff();

	//Tabbed sidebar panels
	var panels=["planeList", "shipList", "planeHistoryList", "stationList", "stats", "faq", "filter", "settings"];
	panels.forEach(panelHide);
	function panelHide(i){
		document.getElementById(i + "Content").style = "display:none";
		document.getElementById(i + "Show").className = 'button';
	}

	//Tabless panels
	document.getElementById("planeContent").style = "display:none";
	document.getElementById("shipContent").style = "display:none";
	document.getElementById("stationContent").style = "display:none";

	//stationDeSelect
	stationSelected = '';
	//heatmapLayerRemove();
	sidebarShow();
	menueHide();
}

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

/***************************************/
/***************Tabs open/close*********/
/***************************************/

function sidebarPanelShow(panel, hook=false){
	var p = String(String(panel).replace('Show', ''));
	var c = String(p + 'Content');
	var s = String(p + 'Show');
	clearSidebar();
	document.getElementById(c).style = "display:block";
	document.getElementById(s).className = 'buttonActive';
	if(hook!=false){
		this[hook]();
	}
}
