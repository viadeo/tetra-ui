tetra.controller.register('api', {
	scope: 'maps',
	constr : function(me, app, page, orm) { return {
		events : {
			view : {
				'maps: load api' : function(api){
					me.methods.loadscript(api);
				},
				'maps: api loaded' : function () {
					page.notify("maps: api loaded");
				}
			},
			controller : {
				'maps: load api' : function(api){
					me.methods.loadscript(api);
				}
			}
		},
		methods : {
			'init' : function () {
			},
			loadscript : function (api) {
				var
					key = api.key ? api.key : "",
					version = api.version ? api.version : "3",
					language = api.language ? api.language : "",
					libraries = api.libraries ? api.libraries : "",
					url = "http://maps.googleapis.com/maps/api/js?"
				;
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url+"key="+key+"&v="+version+"&language="+language+"&libraries="+libraries+"&sensor=false&callback=mapsApiLoaded";
				document.body.appendChild(script);

				window.mapsApiLoaded = function () {
					tetra.controller.notify("maps: api loaded",{},"maps");
					try{
						delete window.mapsApiLoaded;
					}catch(e){}
				}
			}
		}
	};}
});