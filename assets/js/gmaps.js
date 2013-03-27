/* *********************************************************
GEO-LOCATION
********************************************************* */
var getLocation = function(){
        //alert("finding location")
        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);   
};

// onSuccess Geolocation
function onGeoSuccess(position) {
        
        //alert('success');
        $("#userDataStore").data({"geoLat": position.coords.latitude, "geoLong": position.coords.longitude});
        geocoder = new google.maps.Geocoder();
        
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                        //alert(results[1].formatted_address);
                        $("#userDataStore").data({"geoAddress": results[1].formatted_address});
                        $("#aroundMeInfoTitle").html("Current Location");
                        $("#aroundMeInfoContent").html(results[1].formatted_address);
                } else {
                        alert('No results found');
                        }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
        //var element = document.getElementById('geolocation');
        //element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
        //		    'Longitude: '          + position.coords.longitude             + '<br />' +
        //		    'Altitude: '           + position.coords.altitude              + '<br />' +
        //		    'Accuracy: '           + position.coords.accuracy              + '<br />' +
        //		    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
        //		    'Heading: '            + position.coords.heading               + '<br />' +
        //		    'Speed: '              + position.coords.speed                 + '<br />' +
        //		    'Timestamp: '          + position.timestamp          + '<br />';
}

// onError Callback receives a PositionError object
function onGeoError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
}
/* *********************************************************
END GEO-LOCATION
		********************************************************* */

var vehoMap = { 'center': '51.530052,-0.101023', 'zoom': 10};
//51.7206744,-4.761887900000033

$('#gps_map').live('pageinit', function() {
        //demo.add('gps_map', function() {
                $('#loadsMap').gmap({
                    'center': vehoMap.center,
                    'zoom': vehoMap.zoom,
                    'disableDefaultUI':false,
                    'mapTypeControl' : false, 
                    'navigationControl' : true,
                    'streetViewControl' : false, 
                    'callback': function(map) {
                        var self = this;
                        self.watchPosition(function(position, status) {
                                
                                
                                if ( status === 'OK' ) {
                                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                        
                                        
                                        // convert to address
                                        geocoder = new google.maps.Geocoder();
                                        geocoder.geocode({'latLng': latlng}, function(results, status) {
                                            if (status == google.maps.GeocoderStatus.OK) {
                                                if (results[1]) {
                                                        //alert(results[1].formatted_address);
                                                        $("#userDataStore").data({"geoAddress": results[1].formatted_address});
                                                        $("#aroundMeInfoTitle").html("Current Location");
                                                        $("#aroundMeInfoContent").html(results[1].formatted_address);
                                                } else {
                                                        alert('No results found');
                                                        }
                                            } else {
                                                alert('Geocoder failed due to: ' + status);
                                            }
                                        });
                                        
                                        
                                        // are there any markers currently loaded?
                                        if ( !self.get('markers').client ) {
                                                // no marker, so add one
                                                self.addMarker({
                                                        'id': 'client',
                                                        'position': latlng,
                                                        //'bounds': true,
                                                        // need to pass in data in a function
                                                        title: $("#userDataStore").data("firstName") + ' ' + $("#userDataStore").data("lastName")
                                                });
                                                map.setCenter(latlng);
                                                map.setZoom(vehoMap.zoom);
                                                
                                        } else {
                                                self.get('markers').client.setPosition(latlng);
                                                //map.panTo(latlng);
                                        }
                                }
                        });
                }});
        //}).load('gps_map');
});

$('#gps_map').live('pageshow', function() {
        $('#loadsMap').gmap('refresh');
        //getLocation();
});

$('#gps_map').live("pagehide", function() {
        $('#loadsMap').gmap('clearWatch');
});


////////////////////////////////////////////////////////////