<!--navbar-->
<!--desktop mode-->
<div class="navbar desktop" id="navbarDesktop">
	<div class="button">
		<a href="https://adsb.chaos-consulting.de" target="blank">Map</a>
	</div>
	<div class="button">
		<a href="https://chaos-consulting.de" target="blank">Chaos-consulting.de</a>
	</div>
	<div class="button">
		<a href="https://github.com/chaos-consulting/adsberry" target="blank">Build your own!</a>
	</div>
	<div class="button">
		<a href="https://chaos-consulting.de/impressum.php" target="blank">Impressum</a>
	</div>
	<div class="button">
		<a href="about.php">About</a>
	</div>
</div>

<!--mobile mode-->
<div class="navbar mobile" id="navbarMobile">
	<i class="fas fa-bars" onclick="menueToggle()"></i>
	<a href="https://chaos-consulting.de/impressum.php" target="blank">Impressum</a>
	<i class="fas fa-window-close" id="mobileClose" onclick="menueHide(); sidebarHide();"></i>
</div>

<!--menue-->
<div class="mobile menue" id="menue">
	<div class="menueButton mobile"><a href="https://chaos-consulting.de"><i class="fas fa-home"></i><br>chaos-consulting.de</a></div>
	<div class="menueButton mobile"><a href="https://github.com/chaos-consulting/adsberry"><i class="fas fa-tools"></i><br>Build your own</a></div>
	<div class="menueButton mobile"><a href="about.php"><i class="fas fa-book-open"></i><br>About</a></div>
	<div class="menueButton mobile"><i class="fas fa-map" onclick="menueHide(); sidebarHide(); document.getElementById('mobileClose').style = 'display:none';"></i><br>Map</div>
	<div class="menueButton mobile"><i class="fas fa-plane" onclick="planeListShow()"></i><br>Planes</div>
	<div class="menueButton mobile"><i class="fas fa-history" onclick="planeHistoryListShow()"></i><br>History</div>
	<div class="menueButton mobile"><i class="fas fa-wifi" onclick="stationListShow()"></i><br>Stations</div>
	<div class="menueButton mobile"><i class="fas fa-chart-bar" onclick="statsShow()"></i><br>Statistics</div>
	<div class="menueButton mobile"><i class="fas fa-question" onclick="faqShow()"></i><br>FAQ</div>
	<div class="menueButton mobile"><i class="fas fa-thumbtack" onclick="stationLayerToggle(); menueHide();"></i><br>Stations on map</div>
	<div class="menueButton mobile"><i class="fas fa-plane-departure" onclick="airportLayerToggle(); menueHide();"></i><br>Airports on map</div>
	<div class="menueButton mobile"><i class="fas fa-bullseye" onclick="heatmapLayerToggle(); menueHide();"></i><br>Heatmap</div>
	<div class="menueButton mobile"><i class="fas fa-filter" onclick="filterShow()"></i><br>Filter</div>
	<div class="menueButton mobile"><i class="fas fa-bell" onclick="notifyShow()"></i><br>Notifications</div>
</div>
