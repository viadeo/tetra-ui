tetra.controller.register('itinerary', {
	scope: 'maps',
	constr : function(me, app, page, orm) { return {
		events : {
			controller : {
				'maps: api loaded' : function(){
					me.directionsDisplay= {};
					me.directionsService= {};
				},
				'maps: set itinerary' : function(params){
					if(typeof(google) === "undefined") return;

					var
						origin= params.origin,
						destination= params.destination,
						mode= params.mode,
						mapId= params.mapId,
						cbk = params.cbk
					;

					me.methods.start_service(params);

					var request = {
						origin: origin,
						destination: destination,
						travelMode: google.maps.TravelMode[mode],
						durationInTraffic: true // Business Account required
					};

					me.directionsDisplay[mapId].setDirections({routes: []});
					me.directionsService.route(request, function(response, status) {
						if (status === google.maps.DirectionsStatus.OK) {
							me.directionsDisplay[mapId].setDirections(response);
						}
						cbk(status, response);
					});
				},
				'maps: unset itinerary' : function(id){
					me.directionsDisplay[id].setDirections({routes: []});
				}
			}
		},
		methods : {
			start_service : function (params) {
				if(me.directionsDisplay[params.mapId]) return;

				me.directionsService= new google.maps.DirectionsService();

				page.notify(
					"maps: get map",
					{
						mapId:params.mapId,
						cbk: function (map) {
							me.directionsDisplay[params.mapId]= new google.maps.DirectionsRenderer();
							me.directionsDisplay[params.mapId].setMap(map);
							me.directionsDisplay[params.mapId].setPanel(document.getElementById(params.panelId));
						}
					}
				)
			}
		}
	};}
});