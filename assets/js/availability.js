

// initialise vehicle dropdown & get users current position
$('#availability').live('pageinit', function() {
    console.log('availability pageinit');
    navigator.geolocation.getCurrentPosition(onAvailabilityGeoSuccess, onAvailabilityGeoError, {maximumAge:7500, timeout: 5000, enableHighAccuracy:true});
});

$('#availability').on('pageshow', function() {
        console.log('availability pageshow');
        getVehicles();
        //
});	
function onAvailabilityGeoError(error){
        console.log(error);
        console.log(error.code);
        //if(error == 1){
        //        alert('Please turn on geolocation services');
        //}
        
        switch (error.code){
            
            case "1":
                alert('Please turn on geolocation services');
                break;
            
            case "2":
                alert('Sorry, we could not ascertain your location.');
                break;
            
            case "3":
                alert('We could not ascertain your location - the request timed out.');
                break;
        }
        
};

// Grab current location data
function onAvailabilityGeoSuccess(position){
        
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        
        console.log('getCurrentPosition got!');
        console.log(lat);
        console.log(lon);
        
        co_ords = new google.maps.LatLng(lat, lon)
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': co_ords}, function(results, status) {
            
            console.log('geo coding location')
            
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                        
                        
                        var components = results[1].address_components;
                        var postcode = null;
                        var country = null;
                        var placename = null;
                        for (var i = 0, component; component = components[i]; i++) {
                            
                            switch(component.types[0]){
                                
                                case "postal_code":
                                        postcode = component['long_name'];
                                        break;
                                case "country":
                                        country = component['short_name'];
                                        break;
                                case "locality":
                                        placename = component['long_name'];
                                        break;
                                
                            }
                        }
                        
                        console.log(components);
                        
                        $("#userDataStore").data({"geoCountry": country});
                        $("#userDataStore").data({"geoPostcode": postcode});
                        $("#userDataStore").data({"geoPlacename": placename});
                        
                } else {
                        alert('No results found');
                        }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
        
        
}


// POST AVAILABILITY FUNCTION
function postAvailability () {
        
        updateURL = baseUrl + "vehicle/PostVehicle/" + $("#ddlVehicle").val()
                        + '/' + $("#userDataStore").data("geoCountry")
                        + '/' + $("#userDataStore").data("geoPostcode")
                        + '/' + $("#userDataStore").data("geoPlacename")
                        + '/' + $("#userDataStore").data("GUID")
        
        $.mobile.loading( 'show', {
                text: "Posting Availability...",
                textVisible: true,
                theme: "a",
                textonly: false
        });
        $.ajax({
                type: "POST",
                //PostVehicle/{vehicleGuid}/{country}/{postcode}/{place}/{personGuid}
                url: updateURL,
                dataType: "json",
                success: function (data) {
                        $.mobile.loading("hide");
                        alert('Your vehicle availability has been posted to the Vehotrans website.');
                },
                error: function(jqXHR, textStatus, errorThrown ){
                        $.mobile.loading("hide");
                        console.log(updateURL);
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                        alert('Network error has occurred.  Do you have an internet connection? eh?');
                },
        
        });
};

/* *********************************************************
Handle button click
********************************************************* */
$('#btnPostAvailability').click(function(){
        this.validationDefaults = Theme.validationRules;
        this.updateHandler = {
                submitHandler: function(form) {
                        postAvailability();
                }
        }
        this.validationObj = $.extend(
                this.validationDefaults,
                this.updateHandler
        );
        $('#availabilityForm').validate(this.validationObj);
});