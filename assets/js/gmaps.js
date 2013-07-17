



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



var lg_map;
var lg_mgr;
var boundsHasMarkers = false;


function addLoadMarkers(checkBounds){
                
        $.mobile.loading( 'show', {
                text: "Finding Loads Near You...",
                textVisible: checkBounds,
                theme: "a",
                textonly: false
        });
        $.ajax({
                type: "POST",
                url: baseUrl + "load/current/someLocation",
                dataType: "json",
                success: function (data) {
                        $.mobile.loading("hide");
                        
                        console.log(data);
                        
                        var mygc = new google.maps.Geocoder();
                        var myLat, myLon;
                        boundsHasMarkers = false;
                        
                        
                        $.each( data, function(i, load) {
                               
                                mygc.geocode({'address' : load.LoadPlace}, function(results, status){
                                    
                                    myLat = results[0].geometry.location.lat();
                                    myLon = results[0].geometry.location.lng();
                                    
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        
                                        var toolTiptext = "Load available to move";
                                        var objLatLng = new google.maps.LatLng(myLat, myLon)
                                        var marker = new google.maps.Marker({
                                                'position': objLatLng,
                                                'bounds' :false,
                                                title: toolTiptext,
                                                map: lg_map
                                                });
                                        
                                        
                                        content = "some description here";
                                        
                                        
                                        content = "From: " + load.LoadPlace
                                                                + "<br />To: " + load.UnLoadPlace
                                                                + "<br />Collect on: " + load.LoadDate
                                                                + "<br />Length: " + load.Length + ". Weight: " + load.Weight
                                                                + "<br />Service: " + load.Service + ". Express: " + load.IsExpress
                            
                                        //markerPlace, deliveryPlace, dr["LoadingDate"], dr["LengthMetres"], dr["WeightKg"], dr["LoadTypeName"], (bool)dr["IsExpress"] ? "YES" : "NO").Replace("'", @"\'");
                                        
                                        
                                        
                                        
                                        link = "#home";
                                        var Content = '<h4>' + toolTiptext + '</h4>'
                                                + '<p>' + content + '</p>'
                                                + '<a href="mailto:' + load.ContactEmail + '" data-role="button" data-theme="b" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">email</span></span></a>'
                                                + '<a href="tel:' + load.ContactTelephone + '" data-role="button" data-theme="b" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">phone</span></span></a>';
                                               
                                        infoWindow = new google.maps.InfoWindow({ content: Content, position: marker.position, maxWidth: 400 });
                                        
                                        google.maps.event.addListener(marker, "click", function (event) {//             
                                            if (infoWindow) infoWindow.close();
                                            infoWindow = new google.maps.InfoWindow({ content: Content, position: marker.position, maxWidth: 400 });
                                            infoWindow.open(lg_map, marker);
                                            
                                        });
                                        
                                        
                                        lg_mgr.addMarker(marker, 0);
                                        if( lg_map.getBounds().contains(marker.position)){
                                                boundsHasMarkers = true;
                                                //console.log('marker is on the visible map');
                                        }else{
                                                //console.log('marker is NOT on the visible map');  
                                        }
                                        
                                        
                                        
                                        if((!boundsHasMarkers) && ((i+1)== data.length) && checkBounds){
                                           alert("There are no loads near your current location.  Zoom out to see other loads.");      
                                        }
                                        
                                      } else {
                                        alert("Geocode was not successful for the following reason: " + status);
                                      }
                                    
                                });
                                  
                        });
                        
                        
                        
                },
                error: function(jqXHR, textStatus, errorThrown ){
                        $.mobile.loading("hide");
                        alert('Network error has occurred.  Do you have an internet connection?');
                },
                
                
        });
        
        
        
        lg_mgr.refresh();
        
        
};



$('#gps_map').on('pageinit', function() {

 
        
        // initiate the map and the marker manager
        var myOptions = {
            zoom: vehoMap.zoom,
            //center: new google.maps.LatLng(51.530052,-0.101023),
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
                                        
                                        addLoadMarkers(true);
                                        
                                }
                        } else {
                                alert("We could not locate you for the following reason: " + status);
                        }
                });
                
                
        }
        
        navigator.geolocation.getCurrentPosition(self.success, onGeoError, {maximumAge:7500, timeout:5000, enableHighAccuracy:true});
        //navigator.geolocation.watchPosition(self.success, onGeoError, {maximumAge:7500, timeout:5000, enableHighAccuracy:true}); // watchPosition is polling!!!
        
        
        //var listener = google.maps.event.addListener(lg_map, 'bounds_changed', function() {
        //        addLoadMarkers(true);
        //        google.maps.event.removeListener(listener);
        //});
    
        

 
 
 
    
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
//        console.log('bind init');
//        console.log(event);
//        console.log(map);
//});


$('#gps_map').on('pagebeforeshow', function() {
        console.log('pagebeforeshow');
});
$('#gps_map').on('pageshow', function() {
        console.log('pageshow');
        
        
        
        //google.maps.event.trigger(lg_map, "resize");
        
        
});

$('#gps_map').on("pagehide", function() {
        console.log('pagehide');
        //$('#loadsMap').gmap('clearWatch');
        
        
        //addLoadMarkers();
        //google.maps.event.trigger(lg_map, "resize");
});










////////////////////////////////////////////////////////////