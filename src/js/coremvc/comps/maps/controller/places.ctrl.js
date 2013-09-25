tetra.controller.register('places', {
	scope: 'maps',
	constr : function(me, app, page, orm) { return {
		events : {
			controller : {
				'maps: places' : function(){
					if(typeof(google) === "undefined") return;
				}
			}
		},
		methods : {
			init: function() {

			}
		}
	};}
});