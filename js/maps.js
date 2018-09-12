
var map;
var marker;
var markersArray = {};
var finalContent;
var markerLoaded = false;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: CURRENT_LOCATION,
		zoom: 12,
		mapTypeControlOptions: {
			mapTypeIds: ['roadmap']
		}
	});
	map.setMapTypeId('roadmap');
	var currentMarker = null;
	var infoWindow = new google.maps.InfoWindow({ maxWidth: 350});
	ginfo = infoWindow;
	// Centers the map on to the current location with each resize
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(CURRENT_LOCATION);
	});
	// Creation of markers
	for (var i = 0; i < MARKERS.length; i ++) {
		marker = new google.maps.Marker({
			position: MARKERS[i].position,
			map: map,
			icon: 'img/map-marker.svg',
			animation: google.maps.Animation.DROP
		});
		var name = MARKERS[i].name;
        var wikiname = MARKERS[i].wikiname;
		vm.locationList()[i].marker = marker;
		markersArray[name] = marker;
		markerListener(marker, name, wikiname);
		infoWindowListener(marker);
	}
	markerLoaded = true;

	function markerListener(marker, name, wikiname) {

		var contentString = "<div id = 'main'><div id = 'location-name'><h1 id='header'>" + name + "</h1></div><div id = 'wiki-link'></div></div>";
		var url = name;
		var finalContent1=contentString;

		// Renders the content when set up
		marker.addListener('click', function() {
			if (currentMarker) {
				currentMarker.setAnimation(null);
			}
			currentMarker = marker;
			marker.setAnimation(google.maps.Animation.BOUNCE);
			map.setCenter(marker.getPosition());


            //wikipedia API image
            var searchTerm=wikiname
            var wurl="http://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + searchTerm+"&redirects&prop=text&callback=?";
			$.ajax({
				"url": wurl,
				"dataType": "jsonp",
                "timeout": 10000,
                "type": "GET"
			}).done(function (response) {
                console.dir(response);
                wikiHTML = response.parse.text["*"];
                $wikiDOM = $("<document>"+wikiHTML+"</document>");
                wiki = $wikiDOM.find('.image').html();
			    finalContent1 = contentString.concat("<p align=\'left\'>" +wiki +"</p>");

           //wikipedia API intro
		            var wurl1="https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" +searchTerm ;
					$.ajax({
						"url": wurl1,
						"dataType": "jsonp",
		                "timeout": 10000,
		                "type": "GET"
					}).done(function (response) {
		                console.dir(response);
		                var obj = response.query.pages;
		                var ob = Object.keys(obj)[0];
		                wikiHTML = obj[ob]['extract'];
		                wiki = wikiHTML;
						finalContent = finalContent1.concat("<p align=\'left\'>" +wiki +"</p>");
						infoWindow.open(map, marker);
						infoWindow.setContent(finalContent);
					}).fail(function (jqXHR, textStatus) {
						console.log(jqXHR);
						console.log(textStatus);
						var addon = "<p>Can't connect to wiki server!</p></div></div>";
						finalContent = contentString.concat(addon);
						infoWindow.open(map, marker);
						infoWindow.setContent(finalContent);
					});


			});
        });
	}

	function infoWindowListener(marker) {
		infoWindow.addListener('closeclick', function() {
			marker.setAnimation(null);
		});
	}
}
