// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {

	var mapOptions = {
		center : {lat: 47.6, lng: -122.3},
		zoom : 12
	}
	var map = new google.maps.Map(document.getElementById('map'), mapOptions)

	var infoWindow = new google.maps.InfoWindow();

	var markers = [];

	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			data.forEach(function(cam) {
				var marker = new google.maps.Marker({
					position : {lat: Number(cam.location.latitude), lng: Number(cam.location.longitude)},
					label : cam.cameralabel,
					map : map
				})

				markers.push(marker);

				google.maps.event.addListener(marker, 'click', function() {
					map.panTo(this.getPosition());
					var html = '<h3>' + cam.cameralabel + '</h3>' + '<img src="' + cam.imageurl.url + '"</img>';
					infoWindow.setContent(html);
					infoWindow.open(map, this);
				})
			})
		})
		.fail(function(error) {
			alert('Failed to get Seattle Traffic Data');
		})

	$('#search').bind('keyup search', function() {
		var userInput = $('#search').val().toLowerCase();
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].label.toLowerCase().indexOf(userInput) == -1) {
				markers[i].setMap(null);
			} else {
				markers[i].setMap(map);
			}
		}
	})
});