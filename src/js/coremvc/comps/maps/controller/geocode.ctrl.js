tetra.controller.register('geocode', {
	scope: 'maps',
	constr : function(me, app, page, orm) { return {
		events : {
			controller : {
				'maps: geocode' : function(params){
					if(typeof(google) === "undefined") return;
					var geocoder = new google.maps.Geocoder();
					if(typeof(params.address) !=="undefined"){
						geocoder.geocode({address:params.address}, function(results, status) {
							if (status !== google.maps.GeocoderStatus.OK) return params.cbk(null);
							return params.cbk(results[0]);
						});
					}else if (typeof(params.latLng) !=="undefined") {
						var latlng = new google.maps.LatLng(params.latLng[0], params.latLng[1]);
						geocoder.geocode({location:latlng}, function(results, status) {
							if (status !== google.maps.GeocoderStatus.OK) return params.cbk(null);
							return params.cbk(results[1].formatted_address);
						});
					}
				}
			}
		}
	};}
});