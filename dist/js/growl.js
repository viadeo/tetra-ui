/*! Tetra UI v1.3.1 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

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
tetra.view.register('growl', {
	scope: "growl",
	use: ['growl'],
	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					"click" : {
						".growl-close": function(e, elm) {
							me.methods.removeGrowl(_(elm).parent('.growl:first'));
						}
					}
				},
				controller: {
					"add growl container" : function () {
						// _('<div/>') doesn't work
						me.growl = _(document.createElement('div')).attr('id', 'growl-container').appendTo('body');
					},
					"display growl": function(params) {
						app.exec(params.options.template, params, function(html) {
							// _(html) doesn't work
							var growl = _(document.createElement('div')).html(html).contents().appendTo(me.growl);
							if(params.options.width && me.win.width() >= 350) growl.width(params.options.width);
							if(params.options.delay) setTimeout(function(){me.methods.removeGrowl(growl)}, params.options.delay);
							growl.addClass("growl-active");
						});
					},
					"hide growl": function() {
						if(me.growl) {
							me.growl.find(".growl").each(function(i, elm){
								me.methods.removeGrowl(_(elm));
							});
						}
					}
				},
				window:{
					load:function(){
						app.notify('display stacked messages');
					}
				}
			},

			methods: {
				init : function() {
					me.win = _(window);
					me.growl = null;
					me.idle = 500;
				},
				removeGrowl : function (growl) {
					_(growl).removeClass("growl-active");
					setTimeout(function(){
						_(growl).remove()
					},me.idle);
				}
			}
		};
	}
});