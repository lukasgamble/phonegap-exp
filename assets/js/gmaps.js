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

var loadsMarkerArray =[];
var loadMap;


var AddMarkerToManager = function (myMap, markerArray, title, content, link, latitude, longitude) {


        //console.log(displayMap);

        var toolTiptext = title;
        var Content = '<h4>' + title + '</h4>' +
                '<p>' + content + '</p>' +
                '<p><a href="' + link + '">view details / contact seller</a>';
        var objLatLng = CreateLatLngObject(latitude, longitude);
        //console.log(objLatLng);
        var marker = new google.maps.Marker
                ({
                    position: objLatLng,
                    title: toolTiptext,
                    map: loadMap
                });
        
        //console.log(marker);
        
        var infoWindow = new google.maps.InfoWindow({ content: "load", position: objLatLng, maxWidth: 200 });
        
        google.maps.event.addListener(marker, "click", function (event) {//             
            if (infoWindow) infoWindow.close();
            infoWindow = new google.maps.InfoWindow({ content: "load", position: marker.position, maxWidth: 200 });
            infoWindow.open(displayMap, marker);
        });
        
       
        markerArray.push(marker);
        
        
}

// Create Lat/Lon object
var CreateLatLngObject = function (Latitude, Longitude) {
    var latlng = new google.maps.LatLng(parseFloat(Latitude), parseFloat(Longitude));
    return latlng;
}

/*
var displayLoadMarkers = function(map, obj){
        $.mobile.loading( 'show', {
                text: "Finding Loads Near You...",
                textVisible: true,
                theme: "a",
                textonly: false
        });
        $.ajax({
                type: "POST",
                url: baseUrl + "load/current/someLocation",
                dataType: "json",
                success: function (data) {
                        $.mobile.loading("hide");
                        
                        var boundsHasMarkers = false;
                        $.each( data, function(i, load) {
                                
                                
                                //var marker = new google.maps.Marker({ 'position': new google.maps.LatLng(load.LoadLat, load.LoadLon), 'bounds':false });
                                //map.addMarker(marker)
                                
                                
                                AddMarkerToManager(map, loadsMarkerArray,'title', 'content','link',load.LoadLat, load.LoadLon);
                                
                                //console.log(map.getBounds());
                                //if( map.getBounds().contains(marker)){
                                //        // code for showing your object, associated with markers[i]
                                //        boundsHasMarkers = true;
                                //}
                        });
                        
                        //if(!this.boundsHasMarkers){
                        //        alert("There are no loads near your current location.  Zoom out to see other loads.");
                        //}
                        
                        
                        var mgrOptions = { borderPadding: 20, maxZoom: 15, trackMarkers: false };
                        mgr = new MarkerManager(map, mgrOptions);
                        google.maps.event.addListener(mgr, 'loaded', function () {
                            
                            mgr.addMarkers(loadsMarkerArray);
                            console.log('markers loaded');
                        });
                        
                        console.log(loadsMarkerArray);
                       
                },
                
                
                error: function(jqXHR, textStatus, errorThrown ){
                        $.mobile.loading("hide");
                        alert('Network error has occurred.  Do you have an internet connection?');
                },
                
        });
}
*/

var lg_map;
var lg_mgr;
var boundsHasMarkers = false;

$('#gps_map').live('pageinit', function() {

 
        
        // initiate the map and the marker manager
        var myOptions = {
            zoom: vehoMap.zoom,
            center: new google.maps.LatLng(51.530052,-0.101023),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        lg_map = new google.maps.Map(document.getElementById("loadsMap"), myOptions);
        lg_mgr = new MarkerManager(lg_map);

        
        var self = this;
        self.success = function(pos){
                // create latLng object from our position coordinates
                var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                // centre the map at our current position
                lg_map.setCenter(latlng);
                
                // gecode an address from our current position
                var geocdr = new google.maps.Geocoder();
                geocdr.geocode({'latLng': latlng}, function(results, status) {
                        // if google returns OK status we can do some stuff!
                        if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                        $("#userDataStore").data({"geoAddress": results[1].formatted_address});
                                        $("#aroundMeInfoTitle").html("Current Location");
                                        $("#aroundMeInfoContent").html(results[1].formatted_address); 
                                }
                        } else {
                                alert("We could not locate you for the following reason: " + status);
                        }
                });
                
                
        }
        
        //navigator.geolocation.getCurrentPosition(self.success, onGeoError, {maximumAge:75000, timeout:5000, enableHighAccuracy:true});
        navigator.geolocation.watchPosition(self.success, onGeoError, {maximumAge:75000, timeout:5000, enableHighAccuracy:true});
        
        
    
        var listener = google.maps.event.addListener(lg_map, 'tilesloaded', function() {
        
                
                /*
                for (var i = 0; i < 5; i++) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(Math.random() * 180 - 90, Math.random() * 360 - 180),
                        // animation: google.maps.Animation.DROP,
                        // animation disabled because it slows down performance
                        title: "Random marker #" + i
                    });
                    console.log(marker);
                    lg_mgr.addMarker(marker, 0);
                }
                */
                
                $.mobile.loading( 'show', {
                        text: "Finding Loads Near You...",
                        textVisible: true,
                        theme: "a",
                        textonly: false
                });
                $.ajax({
                        type: "POST",
                        url: baseUrl + "load/current/someLocation",
                        dataType: "json",
                        success: function (data) {
                                $.mobile.loading("hide");
                                
                                var mygc = new google.maps.Geocoder();
                                var myLat, myLon;
                                boundsHasMarkers = false;
                                $.each( data, function(i, load) {
                                       
                                        mygc.geocode({'address' : load.LoadPlace}, function(results, status){
                                            
                                            myLat = results[0].geometry.location.lat();
                                            myLon = results[0].geometry.location.lng();
                                            
                                            if (status == google.maps.GeocoderStatus.OK) {
                                                
                                                //map.setCenter(results[0].geometry.location);
                                                //var marker = new google.maps.Marker({
                                                //    map: map,
                                                //    position: results[0].geometry.location
                                                //});
                                                
                                                var marker = new google.maps.Marker({ 'position': new google.maps.LatLng(myLat, myLon), 'bounds':false });
                                                lg_mgr.addMarker(marker, 0);
                                                if( lg_map.getBounds().contains(marker.position)){
                                                        // code for showing your object, associated with markers[i]
                                                        boundsHasMarkers = true;
                                                        console.log('marker is on the visible map');
                                                }
                                                
                                              } else {
                                                alert("Geocode was not successful for the following reason: " + status);
                                              }
                                            
                                        });
                                        
                                        
                                        //loadsMap.addMarker(marker)
                                        //AddMarkerToManager(loadsMap, loadsMarkerArray,'title', 'content','link',load.LoadLat, load.LoadLon);
                                         
                                });
                                
                                
                                
                                
                        },
                        error: function(jqXHR, textStatus, errorThrown ){
                                $.mobile.loading("hide");
                                alert('Network error has occurred.  Do you have an internet connection?');
                        },
                        
                        
                }).done(function(data) {
                        if(!boundsHasMarkers)
                                alert("There are no loads near your current location.  Zoom out to see other loads.");
                });
                
                
                
                lg_mgr.refresh();
                google.maps.event.removeListener(listener);
        });

 
 
 
    
/*
    $('#loadsMap').gmap({
        'center': vehoMap.center,
        'zoom': vehoMap.zoom,
        'disableDefaultUI':false,
        'mapTypeControl' : false, 
        'navigationControl' : true,
        'streetViewControl' : false, 
        'callback': function(map) {
            
            
            var self = this;
            loadsMap = this;
            //map.setCenter(vehoMap.center);
            //map.setZoom(vehoMap.zoom);
            
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
                                
                                //displayLoadMarkers(map, self);
                                
                                
                                
                                $.mobile.loading( 'show', {
                                        text: "Finding Loads Near You...",
                                        textVisible: true,
                                        theme: "a",
                                        textonly: false
                                });
                                $.ajax({
                                        type: "POST",
                                        url: baseUrl + "load/current/someLocation",
                                        dataType: "json",
                                        success: function (data) {
                                                $.mobile.loading("hide");
                                                
                                                var boundsHasMarkers = false;
                                                $.each( data, function(i, load) {
                                                       
                                                        //var marker = new google.maps.Marker({ 'position': new google.maps.LatLng(load.LoadLat, load.LoadLon), 'bounds':false });
                                                        //loadsMap.addMarker(marker)
                                                        AddMarkerToManager(loadsMap, loadsMarkerArray,'title', 'content','link',load.LoadLat, load.LoadLon);
                                                        
                                                });
                                                
                                                loadsMap.setZoom(vehoMap.zoom);
                                                
                                                var mgrOptions = { borderPadding: 20, maxZoom: 15, trackMarkers: false };
                                                mgr = new MarkerManager(loadsMap, mgrOptions);
                                                google.maps.event.addListener(mgr, 'loaded', function () {
                                                    
                                                    mgr.addMarkers(loadsMarkerArray);
                                                    console.log('markers loaded');
                                                });
                                                //mgr.refresh();
                                                console.log(loadsMarkerArray);
                                               
                                        },
                                        error: function(jqXHR, textStatus, errorThrown ){
                                                $.mobile.loading("hide");
                                                alert('Network error has occurred.  Do you have an internet connection?');
                                        },
                                        
                                });
                                
                        } else {
                                alert('Sorry, your location could not be found.');
                                }
                    } else {
                        alert('Geocoder failed due to: ' + status);
                    }
                });
                
                
                // are there any markers currently loaded?
                if ( !self.get('markers').client ) {
                        // no marker, so add one
                        //self.addMarker({
                        //        'id': 'client',
                        //        'position': latlng,
                        //        //'bounds': true,
                        //        // need to pass in data in a function
                        //        title: $("#userDataStore").data("firstName") + ' ' + $("#userDataStore").data("lastName")
                        //});
                        map.setCenter(latlng);
                        map.setZoom(vehoMap.zoom);
                        
                } else {
                        self.get('markers').client.setPosition(latlng);
                        //map.panTo(latlng);
                }
            }

            
            //navigator.geolocation.getCurrentPosition(self.success, onGeoError, {maximumAge: 75000});
            navigator.geolocation.getCurrentPosition(self.success, onGeoError, {maximumAge:75000,timeout:5000,enableHighAccuracy:false});
            
    
           
    }});
*/

}); /* end $('#gps_map').live *********/


//$('#loadsMap').gmap().bind('init', function(event, map) { 
//        console.log(event);
//        console.log(map);
//});

$('#gps_map').live('pageshow', function() {
        
        //$('#loadsMap').gmap('refresh');
        //console.log('map got refreshed');
});

$('#gps_map').live("pagehide", function() {
        $('#loadsMap').gmap('clearWatch');
});










////////////////////////////////////////////////////////////