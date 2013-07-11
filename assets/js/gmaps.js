var getLocation = function(){
        //alert("finding location")
        //navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
        if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
        } else {
            // no native support; maybe try a fallback?
            alert('Your device does not support Geo Location');
            return false;
        }
        
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
        
        // return the position object
        return position;
    
    
    
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

// VehoGroup Ltd. HQ
var vehoMap = { 'center': '51.530052,-0.101023', 'zoom': 10};

$('#gps_map').live('pageinit', function() {

    $('#loadsMap').gmap({
        'center': vehoMap.center,
        'zoom': vehoMap.zoom,
        'disableDefaultUI':false,
        'mapTypeControl' : false, 
        'navigationControl' : true,
        'streetViewControl' : false, 
        'callback': function(map) {
            
            
            var self = this;
            
            self.success = function(pos){
                var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                // convert to address
                geocoder = new google.maps.Geocoder();
                geocoder.geocode({'latLng': latlng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
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

            
            navigator.geolocation.getCurrentPosition(self.success, onGeoError, {maximumAge: 75000});
            
            
    
           
    }});
});

$('#gps_map').live('pageshow', function() {
        $('#loadsMap').gmap('refresh');
        //getLocation();
});

$('#gps_map').live("pagehide", function() {
        $('#loadsMap').gmap('clearWatch');
});


/************** POD Map *******************/
 var loadPODMap = function(latLng, zoom){
        $('#PODMap').gmap({
        'center': latLng,
        'zoom': zoom,
        'disableDefaultUI':false,
        'mapTypeControl' : false, 
        'navigationControl' : true,
        'streetViewControl' : false, 
        'callback': function(map) {
                
                //var currentPosition = new google.maps.LatLong(lat, lon);
                var self = this;
            
                self.success = function(pos){
                        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                        // convert to address
                        geocoder = new google.maps.Geocoder();
                        geocoder.geocode({'latLng': latlng}, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                        $("#userDataStore").data({"geoAddress": results[1].formatted_address});
                                        $("#PODMapInfoTitle").html("Current Location");
                                        $("#PODMapInfoContent").html(results[1].formatted_address);
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
                                map.setZoom(zoom);
                                
                        } else {
                                self.get('markers').client.setPosition(latlng);
                                //map.panTo(latlng);
                        }
                }
        }
        
});
 }
 







////////////////////////////////////////////////////////////