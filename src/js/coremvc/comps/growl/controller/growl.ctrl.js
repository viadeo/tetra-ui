tetra.controller.register('growl', {
	scope: 'growl',
	constr : function(me, app, page, orm) { return {
		events : {
			controller : {
				'growl: display' : function(params){
					if(!me.count) app.notify("add growl container");
					var options = {
						type: 'info',
						width: 350,
						position: 'center',
						delay: 2500,
						dismiss: false,
						template: 'growl'
					}
					app.notify("display growl", {
						message: params.message,
						options: me.methods.extend(options, params.options)
					});
					me.count++;
				},
				'growl: close' : function(){
					app.notify("hide growl");
				}
			}
		},
		methods : {
			init : function () {
				me.count = 0;
			},
			extend : function (target, source) {
				target = target || {};
				for (var prop in source) {
					target[prop] = source[prop];
				}
				return target;
			}
		}
	};}
});