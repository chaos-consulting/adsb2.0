<!DOCTYPE html>
<html>
	<head>
		<title>adsb.chaos-consulting.de - Alpha</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<!--adsb-->
		<link rel="stylesheet" href="css/mainstyle.css" />

		<!--leaflet-->
		<link rel="stylesheet" href="css/leaflet.css" />
		<script src="js/leaflet.js"></script>

		<!--leafletPlugins-->
		<script src="js/leaflet-realtime.js"></script>
		<script src="js/leaflet-heat.js"></script>
		<script src="js/leaflet-activearea.js"></script>

		<!--tabulator-->
		<script src="js/tabulator.js"></script>
		<link rel="stylesheet" href="css/tabulator.css" />

		<!--FontAwesome-->
		<link href="css/all.css" rel="stylesheet">

		<!--Helpers-->
		<script src="js/helpers.js"></script>
		<script src="js/vehicleInfo.js"></script>
		<script src="js/vehicleSelect.js"></script>
		<script src="js/layers.js"></script>
		<script src="js/notify.js"></script>
		<script src="js/stats.js"></script>
		<script src="js/stations.js"></script>
		<script src="js/heatmap.js"></script>
		<script src="js/filter.js"></script>
		<script src="js/magic.js"></script>
		<script src="js/sidebar.js"></script>

		<!--Markers-->
		<script src="js/markers.js"></script>
	</head>
	<body>

		<!--map-->
		<div id="map"></div>
		
		<!-- rc3 banner -->
		<div id="rc3">
			<div id="rc3inner">
				Welcome
				<img id="rc3logo" src="rc3/02a_RC3_Logo_Export_Export.svg"/>
			</div>
		</div>

		<?php include('navbar.php'); ?>

		<?php
			$b=array(
				"sidebarToggle" => array(
					"icon" => "fas fa-angle-double-right",
					"descShort" => "",
					"descLong" => "Show/hide Sidebar",
					"mode" => "desktop",
					"action" => "sidebarToggle()"
				),
				"planeListShow" => array(
					"icon" => "fas fa-plane",
					"descShort" => "Planes",
					"descLong" => "Show list of active planes",
					"mode" => "all",
					"action" => "sidebarPanelShow('planeList')"
				),
				"shipListShow" => array(
					"icon" => "fas fa-ship",
					"descShort" => "Shipss",
					"descLong" => "Show list of active ships",
					"mode" => "all",
					"action" => "sidebarPanelShow('shipList')"
				),
				"planeHistoryListShow" => array(
					"icon" => "fas fa-history",
					"descShort" => "History",
					"descLong" => "Show list of recent planes",
					"mode" => "all",
					"action" => "sidebarPanelShow('planeHistoryList','planeHistoryListShow')"
				),
				"stationListShow" => array(
					"icon" => "fas fa-wifi",
					"descShort" => "Stations",
					"descLong" => "Show list of receiver stations",
					"mode" => "all",
					"action" => "sidebarPanelShow('stationList')"
				),
				"statsShow" => array(
					"icon" => "fas fa-chart-bar",
					"descShort" => "Statistics",
					"descLong" => "Show statistics",
					"mode" => "all",
					"action" => "sidebarPanelShow('stats','statsCalc')"
				),
				"faqShow" => array(
					"icon" => "fas fa-question",
					"descShort" => "FAQ",
					"descLong" => "Show explanation",
					"mode" => "all",
					"action" => "sidebarPanelShow('faq')"
				),
				"filterShow" => array(
					"icon" => "fas fa-filter",
					"descShort" => "Filter",
					"descLong" => "Filter Planes",
					"mode" => "all",
					"action" => "sidebarPanelShow('filter')"
				),
				"settingsShow" => array(
					"icon" => "fas fa-cogs",
					"descShort" => "Settings",
					"descLong" => "Configure various things",
					"mode" => "all",
					"action" => "sidebarPanelShow('settings')"
				),
				"magicToggle" => array(
					"icon" => "fas fa-magic",
					"descShort" => "",
					"descLong" => "Bored? Lets do some magic!",
					"mode" => "desktop",
					"action" => "magicToggle()"
				),
				"geolocationToggle" => array(
					"icon" => "fas fa-crosshairs",
					"descShort" => "",
					"descLong" => "Track your own location",
					"mode" => "all",
					"action" => "geolocationToggle()"
				)
			);
		?>

		<!--menue-->
		<div class="mobile menue" id="menue">
			<div class="menueButton mobile"><a href="https://chaos-consulting.de"><i class="fas fa-home"></i><br>chaos-consulting.de</a></div>
			<div class="menueButton mobile"><a href="https://github.com/chaos-consulting/adsberry"><i class="fas fa-tools"></i><br>Build your own</a></div>
			<div class="menueButton mobile"><a href="about.php"><i class="fas fa-book-open"></i><br>About</a></div>
			<div class="menueButton mobile"><i class="fas fa-map" onclick="menueHide(); sidebarHide(); document.getElementById('mobileClose').style = 'display:none';"></i><br>Map</div>
			<?php
				foreach($b as $id => $a){
					if($a['mode']=='all'){
						echo '<div class="menueButton mobile"><i class="'.$a['icon'].'" onclick="'.$a['action'].'"></i><br>'.$a['descShort'].'</div>';
					}
				}
			?>
		</div>

		<!--tabbar-->
		<div class="tabbar desktop" id="tabbar">
			<?php
				$extra=$_GET['extra'];
				foreach($b as $id => $a){
					if($a['mode']=='desktop' or $a['mode']=='all'){
						echo '<div class="button" id="'.$id.'" onclick="'.$a['action'].'" title="'.$a['descLong'].'"><i class="'.$a['icon'].'"></i></div>';
					}
					if($extra==true and $a['mode']=='extra'){
						echo '<div class="button" id="'.$id.'" onclick="'.$a['action'].'" title="'.$a['descLong'].'"><i class="'.$a['icon'].'"></i></div>';
					}
				}
			?>
		</div>

		<!--sidebar-->
		<div class="sidebar" id="sidebar">

			<!--content-->
			<!--planelist-->
			<div class="content" id="planeListContent">

				<!--tabulator-->
				<div id="planelist"></div>
			</div>

			<!--content-->
			<!--shiplist-->
			<div class="content" id="shipListContent">

				<!--tabulator-->
				<div id="shiplist"></div>
			</div>

			<!--planeHistoryList-->
			<div class="content" id="planeHistoryListContent">

				<!--planeHistoryListTabulator-->
				<div id="planeHistoryList"></div>
			</div>

			<!--plane-->
			<div class="content" id="planeContent">

				<!--info-->
				<table id="planeInfoTable">
					<thead>
						<tr><td colspan="3"><i id="planeInfoTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planeInfoTable')"></i> Info<div class="desktop" onclick="vehicleDeSelect('plane')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="planeInfoTableBody">
						<tr><td>ICAO</td><td id="planeId">n/a</td><td id="planeRegistration">n/a</td></tr>
						<tr><td>Flight</td><td colspan="2" id="planeFlight">n/a</td></tr>
						<tr><td>Country</td><td colspan="2" id="planeCountry">n/a</td></tr>
						<tr><td>Airline</td><td colspan="2" id="planeAirline">n/a</td></tr>
						<tr><td>Plane</td><td id="planeModel">n/a</td><td id="planeModelLong">n/a</td></tr>
						<tr><td>Squawk</td><td id="planeSquawk">n/a</td><td id="planeSquawkLong">n/a</td></tr>
						<tr><td>Seen</td><td colspan="2" id="planeSeen">n/a</td></tr>
						<tr><td>Link</td><td colspan="2" id="planeLink"></td></tr>
					</tbody>
				</table>
				</br>

				<!--position-->
				<table id="planePositionTable">
					<thead>
						<tr><td colspan="3"><i id="planePositionTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planePositionTable')"></i> Position<div id="vehicleFocus" onclick="vehicleFocusToggle()" title="toggle follow aircraft"><i class="fas fa-crosshairs"></i></div></td></tr>
					</thead>
					<tbody id="planePositionTableBody">
						<tr><td>Lat/Lon</td><td id="planeLatLon" colspan="2">n/a</td></tr>
						<tr><td>Direction</td><td id="planeTrack" colspan="2">n/a</td></tr>
						<tr><td>Altitude</td><td id="planeAltitudeNowMetric">n/a</td><td id="planeAltitudeNow">n/a</td></tr>
						<tr><td>Speed</td><td id="planeSpeedNowMetric">n/a</td><td id="planeSpeedNow">n/a</td></tr>
						<tr><td>Age</td><td id="planeSeenPos" colspan="2">n/a</td></tr>
					</tbody>
				</table>
				</br>

				<!--picture-->
				<table>
					<thead>
						<tr><td><i id="planePictureTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planePictureTable')"></i> Picture</td></tr>
					</thead>
					<tbody id="planePictureTableBody">
						<tr><td id="planePicture"><img id="planePictureImage"></td></tr>
						<tr><td id="planeDescription"></td></tr>
					</tbody>
				</table>
				</br>

				<!--History-->
				<table>
					<thead>
						<tr><td colspan="2" ><i id="planeHistoryTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('planeHistoryTable')"></i> History</td></tr>
					</thead>
					<tbody id="planeHistoryTableBody">
						<tr><td>Export Track as geojson</td><td><a id="exportTrackGeojson" href="" target="_blank" title="export track"><i class="fas fa-save"></i></a></td></tr>
					</tbody>
				</table>
				</br>

				<!--stations-->
				<!--tabulator-->
				<div id="planeStations"></div>
				</br>
			</div>

			<!--ship-->
			<div class="content" id="shipContent">

				<!--info-->
				<table id="shipInfoTable">
					<thead>
						<tr><td colspan="3"><i id="shipInfoTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipInfoTable')"></i> Info<div class="desktop" onclick="vehicleDeSelect('ship')"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody id="shipInfoTableBody">
						<tr><td>MMSI</td><td colspan="2" id="shipId">n/a</td></tr>
						<tr><td>Name</td><td colspan="2" id="shipName">n/a</td></tr>
						<tr><td>Callsign</td><td colspan="2" id="shipCallsign">n/a</td></tr>
						<tr><td>Country</td><td colspan="2" id="shipCountry">n/a</td></tr>
						<tr><td>Type</td><td id="shipType">n/a</td><td id="shipTypeText">n/a</td></tr>
						<tr><td>Length/width</td><td id="shipLength">n/a</td><td id="shipWidth">n/a</td></tr>
						<tr><td>Draught</td><td colspan="2" id="shipDraught">n/a</td></tr>
						<tr><td>Status</td><td id="shipStatus">n/a</td><td id="shipStatusText">n/a</td></tr>
						<tr><td>Destination</td><td colspan="2" id="shipDestination">n/a</td></tr>
						<tr><td>Est. arrival</td><td colspan="2" id="shipEta">n/a</td></tr>
						<tr><td>Seen</td><td colspan="2" id="shipSeen">n/a</td></tr>
						<tr><td>Link</td><td colspan="2" id="shipLink"></td></tr>
					</tbody>
				</table>
				</br>

				<!--position-->
				<table id="shipPositionTable">
					<thead>
						<tr><td colspan="3"><i id="shipPositionTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipPositionTable')"></i> Position<div id="vehicleFocus2" onclick="vehicleFocusToggle()" title="toggle follow aircraft"><i class="fas fa-crosshairs"></i></div></td></tr>
					</thead>
					<tbody id="shipPositionTableBody">
						<tr><td>Lat/Lon</td><td id="shipLatLon" colspan="2">n/a</td></tr>
						<tr><td>Direction</td><td id="shipCourse">n/a</td><td id="shipHeading">n/a</td></tr>
						<tr><td>Speed</td><td id="shipSpeedNowMetric">n/a</td><td id="shipSpeedNow">n/a</td></tr>
					</tbody>
				</table>
				</br>

				<!--History-->
				<table>
					<thead>
						<tr><td colspan="2" ><i id="shipHistoryTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipHistoryTable')"></i> History</td></tr>
					</thead>
					<tbody id="shipHistoryTableBody">
						<tr><td>Export Track as geojson</td><td><a id="exportShipTrackGeojson" href="" target="_blank" title="export track"><i class="fas fa-save"></i></a></td></tr>
					</tbody>
				</table>
				</br>

				<!--stations-->
				<!--<div id="shipStations">
				<table id="shipStationsTable">
					<thead>
						<tr><td colspan="3"><i id="shipStationsTableToggle" class="fas fa-minus-square" onclick="tableCollapseToggle('shipStationsTable')"></i> Stations</td></tr>
					</thead>
					<tbody id="shipStationsTableBody">
						<tr><td id="shipStation">n/a</td><td id="shipLatLon" colspan="2">n/a</td></tr>
					</tbody>
				</table>
				</div>
				</br>-->

				<!--stations-->
				<!--tabulator-->
				<div id="shipStations"></div>
				</br>

			</div>

			<!--stationlist-->
			<div class="content" id="stationListContent">

				<!--tabulator-->
				<div id="stationlist"></div>
			</div>

			<!--station-->
			<div class="content" id="stationContent">

				<!--info-->
				<table>
					<thead>
						<tr><td colspan="2">Info<div onclick="stationDeSelect()"><i class="fas fa-window-close"></i></div></td></tr>
					</thead>
					<tbody>
						<tr><td>Name</td><td id="stationName">n/a</td></tr>
						<tr><td>Last seen</td><td id="stationSeen">n/a</td></tr>
						<tr><td>Planes</td><td id="stationPlanes">n/a</td></tr>
						<tr><td>Planes with Position</td><td id="stationPositions">n/a</td></tr>
						<tr><td>Planes with MLAT</td><td id="stationMlats">n/a</td></tr>
						<tr><td>Link</td><td id="stationLink">n/a</td></tr>
					</tbody>
				</table>
				</br>

				<!--mlat-->
				<!--tabulator-->
				<div id="stationMlatPeersTable"></div>
				</br>
				<div class="infobox">
					<h1>Please note</h1>
					Only MLAT enabled Stations are shown on map with a location marker. If your station does not send MLAT already, think about adding it.</br>
					Positions are only approximate to protect the station owners privacy.
				</div>
			</div>

			<!--stats-->
			<div class="content" id="statsContent">
				<h1>Statistics <i class='fas fa-sync-alt' title='Refresh' onclick='statsCalc()'></i></h1>

				<!--tabulator-->
				<div id="statsPositionsTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsTypesTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsStationsTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsModelsTable"></div>
				</br>

				<!--tabulator-->
				<div id="statsAirlinesTable"></div>
				</br>
				<div class="infobox">
					<h1>Please note</h1>
					These statistics are not influenced by any filters you may have set.</br>
					We are using every aircraft from every station at every given point of time to calculate these stats.
				</div>
			</div>

			<!--faq-->
			<div class="content" id="faqContent">
				<h1>Explanation</h1>
				<h2>Altitude colors</h2>
				<table>
					<thead>
						<tr><td>Color</td><td>m</td><td>ft</td></tr>
					</thead>
					<tbody>
						<tr><td style="background-color:#aaa"></td><td>0</td><td>0</td></tr>
						<tr><td style="background-color:#a52a2a"></td><td>1+</td><td>1+</td></tr>
						<tr><td style="background-color:#d97012"></td><td>305+</td><td>1.000+</td></tr>
						<tr><td style="background-color:#ffa500"></td><td>610+</td><td>2.000+</td></tr>
						<tr><td style="background-color:#ffcc00"></td><td>915+</td><td>3.000+</td></tr>
						<tr><td style="background-color:#ff0"></td><td>1373+</td><td>4.500+</td></tr>
						<tr><td style="background-color:#afda21"></td><td>1.830+</td><td>6.000+</td></tr>
						<tr><td style="background-color:#45a94d"></td><td>2.288+</td><td>7.500+</td></tr>
						<tr><td style="background-color:#51b67b"></td><td>2.745+</td><td>9.000+</td></tr>
						<tr><td style="background-color:#61c7b8"></td><td>3.202+</td><td>10.500+</td></tr>
						<tr><td style="background-color:#4dacd6"></td><td>3.360+</td><td>12.000+</td></tr>
						<tr><td style="background-color:#3388ff"></td><td>4.117+</td><td>13.500+</td></tr>
					</tbody>
				</table>
				<h2>Type colors</h2>
				<table>
					<thead>
						<tr><td>Color</td><td>Type</td></tr>
					</thead>
					<tbody>
						<tr><td style="background-color:#f00"></td><td>Rescue and Police</td></tr>
						<tr><td style="background-color:#0f0"></td><td>Military</td></tr>
						<tr><td style="background-color:#ff00c3"></td><td>Interesting</td></tr>
					</tbody>
				</table>
				<h2>Planes</h2>
				<table>
					<tbody>
						<tr><td><i class="fas fa-check-circle"></i></td><td>This station recently received a position transmitted by the aircraft</td></tr>
						<tr><td><i class="fas fa-compass"></i></td><td>This station is contributing to the calculation of the aircrafts approximate position via MLAT</td></tr>
						<tr><td><i class="fas fa-times-circle"></i></td><td>This station has no recent position for this aircraft</td></tr>
					</tbody>
				</table>
				<h2>MLAT</h2>
				Semi transparent planes do not send a position so we calculate the approximate position via Multilateration (MLAT)
				<h2>Buttons</h2>
				<i class="fas fa-angle-double-left"></i> Show sidebar</br></br>
				<i class="fas fa-angle-double-right"></i> Hide sidebar</br></br>
				<i class="fas fa-plane"></i> Show list of active planes</br></br>
				<i class="fas fa-history"></i> Show history of recent flights</br></br>
				<i class="fas fa-wifi"></i> Show list of receiver stations</br></br>
				<i class="fas fa-chart-bar"></i> Show statistics</br></br>
				<i class="fas fa-question"></i> Show the Help</br></br>
				<i class="fas fa-thumbtack"></i> Show/hide the stations on the map</br></br>
				<i class="fas fa-bullseye"></i> Show/hide the overall heatmap (changes to stations heatmap when station is selected)</br></br>
				<i class="fas fa-filter"></i> Configure different filters</br></br>
				<i class="fas fa-bell"></i> Configure desktop notifications</br></br>
				<i class="fas fa-magic"></i> Bored? Lets do some magic!</br></br>
				<i class="fas fa-window-close"></i> Deselect plane</br></br>
				<i class="fas fa-crosshairs"></i> Follow selected plane, klick again to stop</br></br>
				<i class="fas fa-plus-square"></i> Expand section</br></br>
				<i class="fas fa-minus-square"></i> Collapse section</br></br>
				<h2>More</h2>
				<a href="https://en.wikipedia.org/wiki/Lists_of_airlines">https://en.wikipedia.org/wiki/Lists_of_airlines</a>
			</div>

			<!--filter-->
			<div class="content" id="filterContent">
				<table>
					<thead>
						<tr><td colspan="5">Filter by type</td></tr>
					</thead>
					<tbody>
						<tr>
							<td id="filterTypeAll" class="filterActive" onclick="filterTypeSet('all')">All</td>
							<td id="filterTypeBim" class="filter" onclick="filterTypeSet('bim')">BIM</td>
							<td id="filterTypeBos" class="filter" onclick="filterTypeSet('bos')">BOS</td>
							<td id="filterTypeInt" class="filter" onclick="filterTypeSet('int')">Interesting</td>
							<td id="filterTypeMil" class="filter" onclick="filterTypeSet('mil')">Military</td>
						</tr>
					</tbody>
				</table>
				<br>
				<table>
					<thead>
						<tr><td colspan="5">Filter by fix</td></tr>
					</thead>
					<tbody>
						<tr>
							<td id="filterFixAll" class="filterActive" onclick="filterFixSet('all')">All</td>
							<td id="filterFixTrue" class="filter" onclick="filterFixSet('true')"><script>document.write(fixToIcon('true'))</script></td>
							<td id="filterFixMlat" class="filter" onclick="filterFixSet('mlat')"><script>document.write(fixToIcon('mlat'))</script></td>
							<td id="filterFixFalse" class="filter" onclick="filterFixSet('false')"><script>document.write(fixToIcon('false'))</script></td>
						</tr>
					</tbody>
				</table>
				<br>
				<table>
					<thead>
						<tr><td colspan="12">Filter by altitude</td></tr>
						<tr id="filterAltitudeList"></tr>
					</thead>
				</table>
				<br>
				<table>
					<thead>
						<tr><td colspan="5">Filter by source</td></tr>
					</thead>
					<tbody>
						<tr>
							<td id="filterSourceAll" class="filterActive" onclick="filterSourceSet('all')">All</td>
							<td id="filterSourceAdsb" class="filter" onclick="filterSourceSet('adsb')">ADS-B</td>
							<td id="filterSourceAis" class="filter" onclick="filterSourceSet('ais')">AIS</td>
						</tr>
					</tbody>
				</table>
				<br>
				<table>
					<thead>
						<tr><td colspan="5">Only show selected vehicle</td></tr>
					</thead>
					<tbody>
						<tr>
							<td id="filterSelectedAll" class="filterActive" onclick="filterSelectedSet('all')">All</td>
							<td id="filterSelectedSingle" class="filter" onclick="filterSelectedSet('single')">Single</td>
						</tr>
					</tbody>
				</table>
				<br>
				<table>
					<thead>
						<tr><td>Filter by station</td></tr>
					</thead>
				</table>
				<div id="filterStationList"></div>
				<!--<table>
					<thead>
						<tr><td>Filter by model</td></tr>
					</thead>
				</table>
				<div id="filterModelList"></div>
				<br>-->
				<br>
			</div>

			<!--settings-->
			<div class="content" id="settingsContent">

				<!--Map options-->
				<table>
					<thead>
						<tr><td colspan="3"><i class="fas fa-globe-europe"></i> Map options</td></tr>
					</thead>
					<tbody>
						<tr><td>Planes</td><td id="planeLayerToggle" class="buttonActive" onclick="layerToggle(planeLayer, 'planeLayerToggle')"><i class="fas fa-plane"></i></td></tr>
						<tr><td>Ships</td><td id="shipLayerToggle" class="buttonActive" onclick="layerToggle(shipLayer, 'shipLayerToggle')"><i class="fas fa-ship"></i></td></tr>
						<tr><td>Airports</td><td id="airportLayerToggle" class="buttonActive" onclick="layerToggle(airportLayer, 'airportLayerToggle')"><i class="fas fa-plane-departure"></i></td></tr>
						<tr><td>Receiver Stations</td><td id="stationLayerToggle" class="buttonActive" onclick="layerToggle(stationLayer, 'stationLayerToggle')"><i class="fas fa-wifi"></i></td></tr>
						<tr><td>MLAT Mesh</td><td id="meshLayerToggle" class="button" onclick="layerToggle(meshLayer, 'meshLayerToggle')"><i class="fas fa-dice-d20"></i></td></tr>
						<tr><td>Heatmap</td><td id="heatmapLayerToggle" class="button" onclick="heatmapLayerToggle()"><i class="fas fa-bullseye"></i></td></tr>
						<tr><td>OpenSeaMap</td><td id="openSeaMapToggle" class="button" onclick="layerToggle(openSeaMapLayer, 'openSeaMapToggle')"><i class="fas fa-ship"></i></td></tr>
						<tr><td>Precipitation radar</td><td id="precipitationRadarToggle" class="button" onclick="layerToggle(precipitationLayer, 'precipitationRadarToggle')"><i class="fas fa-cloud-showers-heavy"></i></td></tr>
						<tr><td>Weather warnings</td><td id="weatherWarningToggle" class="button" onclick="layerToggle(weatherWarningLayer, 'weatherWarningToggle')"><i class="fas fa-exclamation-triangle"></i></td></tr>
						<tr><td>Water levels</td><td id="pegelOnlineToggle" class="button" onclick="layerToggle(pegelOnlineLayer, 'pegelOnlineToggle')"><i class="fas fa-water"></i></td></tr>
						<tr><td>Ovals</td><td id="ovalsToggle" class="button" onclick="layerToggle(ovalsLayer, 'ovalsToggle')"><i class="fas fa-circle-notch"></i></td></tr>
					</tbody>
				</table>
				<br>

				<!--notifications-->
				<table>
					<thead>
						<tr><td colspan="3"><i class="far fa-comment-alt"></i> Desktop notifications</td></tr>
					</thead>
					<tbody>
						<tr><td>Notification</td><td id="notifyIndicator" onclick="notifyToggle()"><i class="fas fa-comment-slash"></i></td></tr>
						<tr><td>Notification Sound</td><td id="notifySoundIndicator" onclick="notifySoundToggle()"><i class="fas fa-volume-mute"></i></td></tr>
						<tr><td>Send a test notification</td><td colspan="2" onclick="notify('This is a test')"><i class="fas fa-paper-plane"></i></td></tr>
						<tr><td colspan="3">Will send a notification to your desktop if there is an interesting aircraft to see</td></tr>
					</tbody>
				</table>
				<br>
				<div class="infobox">
					<h1>Please note</h1>
					To use desktop notifications your browser must support it and be configured allow it for this site.</br>
					Acoustic notifications are an addon to desktop notifications, they will not work standalone.
				</div>
			</div>
		</div>

		<!--Sanduhr-->
		<i id="activityIndicator" class="far fa-hourglass"></i>
	</body>

	<!--tables-->
	<script src="js/tables.js"></script>

	<!--script-->
	<script src="js/script.js"></script>

	<script src="js/ovals.js"></script>
	<script src="js/geolocation.js"></script>
</html>
