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