<!DOCTYPE html>
<html>
	<head>
		<title>adsb.chaos-consulting.de - Alpha</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<!--adsb-->
		<link rel="stylesheet" href="css/about.css" />

		<!--FontAwesome-->
		<link href="css/all.css" rel="stylesheet">

		<!--dump1090 Markers-->
		<script src="js/markers.js"></script>

	</head>
	<body onload="attribution()">

		<?php include('navbar.php'); ?>

			<h1 style="clear:left">About</h1>
			We are a community of hobbyists bulding our own ADS-B map. We are building this in our spare time without any commercial interest. We are always in search for likeminded people, so if you like this website consider building your own station and contribute your data.
			<br>
			Read our Instructions on how to build a receiver station and how to feed data to us.
			<br><br>
			<a href="https://adsberry.chaos-consulting.de" target="blank">->Instructions on Github<-</a>
			<h1>Attributions</h1>
			This webapp ist open source and is made with open source components. Without the great tools below this would not be possible.
			<br>
			<hr>
			<h2>Leafletjs</h2>
			This is the libary we are using to build the interactive map <a href="https://leafletjs.com">https://leafletjs.com</a>
			<hr>
			<h2>Leaflet-realtime</h2>
			Making those planes move <a href="https://github.com/perliedman/leaflet-realtime">https://github.com/perliedman/leaflet-realtime</a>
			<hr>
			<h2>Leaflet-active-area</h2>
			Doin good stuff <a href="https://github.com/Mappy/Leaflet-active-area">https://github.com/Mappy/Leaflet-active-area</a>
			<hr>
			<h2>Font-Awesome</h2>
			For all the pretty clicky icons <a href="https://fontawesome.com/">https://fontawesome.com</a>
			<hr>
			<h2>Tabulator</h2>
			Dynamic sortable tables in the sidebar <a href="http://tabulator.info">http://tabulator.info</a>
			<hr>
			<h2>Openstreetmap</h2>
			All map data <a href="https://www.openstreetmap.org/copyright">https://www.openstreetmap.org/copyright</a>
			<hr>
			<h2>Wikipedia</h2>
			All the knowledge about airlines and planes <a href="https://de.wikipedia.org">https://de.wikipedia.org</a>
			<h2>Markers</h2>
			<div id="attributionMarkers"></div>
			<hr>
			<br><br>
			If you want to see the code of this website you can find it here: 

	</body>

	<!--script-->
	<script>
	//Attribution
function attribution(){
	var output="<table><thead><tr><td>Marker</td><td>License</td><td>Origin</td></thead><tbody>";
	Object.values(markers).forEach(
		function(i){
			Object.entries(i).forEach(
				function(ii){
					console.log(ii);
					output += "<tr><td>" + ii[0] + "</td><td>" + ii[1].license + "</td><td>" + ii[1].origin + "</td></tr>";
				}
			)
		}
	)
	output += "</tbody></table>";
	document.getElementById("attributionMarkers").innerHTML = output;
}
	</script>
</html>
