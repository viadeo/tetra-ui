tetra.controller.register('geocode', {
	scope: 'maps',
	constr : function(me, app, page, orm) { return {
		events : {
			controller : {
				'maps: geocode' : function(params){
					if(typeof(google) === "undefined") return;
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode(params, function(results, status) {
						if (status !== google.maps.GeocoderStatus.OK) return params.cbk(null);
						if(params.hasOwnProperty('address')) return params.cbk(results[0]);
						if(params.hasOwnProperty('latlng')) return params.cbk(results[1].formatted_address);
					});
				}
			}
		},
		methods : {
		}
	};}
});