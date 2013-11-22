tetra.controller.register('growl', {
	scope: 'growl',
	constr : function(me, app, page, orm) { return {
		events : {
			controller : {
				'growl: display' : function(params){
					if(me.ready){
						if(!me.count) app.notify("add growl container");
						
						app.notify("display growl", {
							message: params.message,
							options: me.methods.extend(me.options, params.options)
						});
						me.count++;
					}
					else{
						me.growlStack.push({
							message: params.message,
							options: me.methods.extend(me.options, params.options)
						});
					}
				},
				'growl: close' : function(){
					app.notify("hide growl");
				}
			},
			view:{
				'display stacked messages':function(){
					me.ready = true;
					if(!me.count) app.notify("add growl container");
					
					for(var i = 0, l = me.growlStack.length; i < l; i++){
						app.notify("display growl", {
							message: me.growlStack[i].message,
							options: me.growlStack[i].options
						});

						me.count++;
					}
				}
			}
		},
		methods : {
			init : function () {
				me.count = 0;
				me.ready = false;
				me.options = {
					type: 'info',
					width: 350,
					position: 'center',
					delay: 2500,
					dismiss: false,
					template: 'growl'
				};
				me.growlStack = [];
			},
			extend : function (base, source) {
				var extended = {};
				for (var baseProperty in base){
					extended[baseProperty] = base[baseProperty];
				}
				for (var sourceProperty in source) {
					extended[sourceProperty] = source[sourceProperty];
				}
				return extended;
			}
		}
	};}
});