////////////////////////////////////////////////////////////
		
//function detectBrowser() {
//	var useragent = navigator.userAgent;
//	var mapdiv = document.getElementById("map-canvas");
//      
//	if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
//		mapdiv.style.width = '100%';
//		mapdiv.style.height = '100%';
//	} else {
//		mapdiv.style.width = '600px';
//		mapdiv.style.height = '800px';
//	}
//}

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
                                        // are there any markers currently loaded?
                                        if ( !self.get('markers').client ) {
                                                // no marker, so add one
                                                self.addMarker({
                                                        'id': 'client',
                                                        'position': latlng,
                                                        //'bounds': true,
                                                        // need to pass in data in a function
                                                        //title: $("#userDataStore").data("firstName") + ' ' + $("#userDataStore").data("lastName")
                                                });
                                                //map.setZoom(vehoMap.zoom);
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
        //demo.add('gps_map', function() { $('#loadsMap').gmap('refresh'); }).load('gps_map');
        $('#loadsMap').gmap('refresh');
        //console.log('pageshow');
});

$('#gps_map').live("pagehide", function() {
        //demo.add('gps_map', function() { $('#loadsMap').gmap('clearWatch'); }).load('gps_map');
        $('#loadsMap').gmap('clearWatch');
        //console.log('pagehide');
});


////////////////////////////////////////////////////////////