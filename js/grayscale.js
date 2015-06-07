"use strict";

var map;
var infowindow;
var latlong;
var autocomplete;
var searchTypes = [];



function compareLatLng(a,b) {
  if (a.latlongdistance < b.latlongdistance)
    return -1;
  if (a.latlongdistance > b.latlongdistance)
    return 1;
  return 0;
}



function createMarker(place) {
  console.log("Dropping", place.name, place);

  //<tr><th></th><th>Name</th><th>Address</th><th>Distance</th></tr>
  place.latlongdistance = google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, latlong) / 1609;
  place.latlongdistance =  Math.round(place.latlongdistance * 100) / 100;

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    //console.log("Showing", place.name);
    infowindow.setContent("<div style='color:black;'>" + place.name + "&nbsp;</div>");
    infowindow.open(map, this);
  });
}

function searchCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    $(".map_row").remove();

    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      //console.log(results[i]);
    }

    results.sort(compareLatLng);

    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      $("#resultList").append('<tr class="map_row">'+
        '<td><img width="16px" src="'+place.icon+'"></td>'+
        '<td>'+place.name+'</td>'+
        '<td>'+place.vicinity+'</td>'+
        '<td>'+place.latlongdistance+'</td>'+

        '</tr>');

    }


  }
}



function loadMap(lat, lng) {

    latlong = new google.maps.LatLng(lat, lng);


    map = new google.maps.Map(document.getElementById('map'), {
      center: latlong,
      zoom: 13
    });


    $("#latitude").text(lat);
    $("#longitude").text(lng);

    gatherSearchToggles();

    var request = {
      location: latlong,
      radius: 1500,
      types: searchTypes
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, searchCallback);






/*

  var location = lat + ',' + lng;

  var requestOptions = {
    url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    qs: {
      key: googleApiKey,
      location: location,
      radius: 1600,
      type: 'restaurant'
    },
    json: true
  };
*/



}

function initAutoComplete() {

  autocomplete = new google.maps.places.Autocomplete($("#frontiersearch")[0], {});

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          var lat = place.geometry.location.lat();
          var lng = place.geometry.location.lng();

          loadMap(lat, lng);
          scrollToMap();

  });


}


initAutoComplete() ;

function scrollToMap() {
  $('html, body').animate({
      scrollTop: $("#searchtoggles").offset().top - 55
  }, 2000);

}



function showPosition(position) {

  loadMap(position.coords.latitude, position.coords.longitude);
  console.log("scroll to", $("#mapsection").offset().top);

  scrollToMap();

}


function gatherSearchToggles() {

  searchTypes = [];

    $( ".searchtoggle").each(function( index ) {
        var searchType = $(this).val();
        if($(this).is(':checked')) {
            searchTypes.push(searchType);
            console.log(searchType, "Checked");
        } else {
          console.log(searchType, "NOT Checked");
        }
    });

    if(searchTypes.length == 0) {
      $( "#allwarning").show();
    } else {
      $( "#allwarning").hide();
    }

    console.log(searchTypes);

}

//ready()
$(function(){

  //gather toggles

    $("html,body").animate({scrollTop: 0}, 100); //100ms for example

    $('.searchtoggle').click(function() {
      gatherSearchToggles();
      loadMap(latlong.lat(), latlong.lng());
    });


    if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
     } else {
         x.innerHTML = "Geolocation is not supported by this browser.";
     }




});









/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

/*

// Google Maps Scripts
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions

    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(40.6700, -73.9400), // New York

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image = 'img/map-marker.png';
    var myLatLng = new google.maps.LatLng(40.6700, -73.9400);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });


}
*/
