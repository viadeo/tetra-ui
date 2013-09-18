/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register('dropdown', {
	scope: 'dropdown',
	constr: function(me, app, page) {

		'use strict';

		return {
			events: {
				model: {},

				view: {
					'share btn through apps': function(param) {
						page.notify('retrieve btn from dropdown comp', param);
					}
				},

				controller: {
					'dropdown: close all': function() {
						app.notify('close all');
					}
				}

			},

			methods: {
				init: function() {
				}
			}
		};
	}
});

tetra.view.register('view', {
	use: ['dropdown'],
	scope: 'dropdown',
	constr: function(me, app, _) {

		'use strict';

		return {

			events: {
				user: {
					'click': {
						'.dd': function(e, elm) {
							var btn = elm.find(".dd-btn:first");
							me.methods.initDd(e, btn, elm);
						}

					},
					'mouseover': {
						'.dd': function(e, elm) {
							var btn = elm.find(".dd-btn:first");
							me.methods.initDd(e, btn, elm);
						}

					},
					'clickout': {
						'.dd': function(e, elm) {
							var btn = elm.find(".dd-btn:first");

							/* prevent conflict on multi event handler */
							if(btn.attr("data-event") === "click") {
								me.methods.closeDd(btn, elm);
							}
						}
					},
					'mouseout': {
						'.dd': function(e, elm) {
							var btn = elm.find(".dd-btn:first");

							/* prevent conflict on multi event handler */
							if(btn.attr("data-event") === "mouseover") {
								me.methods.closeDd(btn, elm);
							}
						}
					}
				},

				controller: {
					'close all': function() {
						_('.dd-btn').removeClass("active");
						_('.dd').removeClass("open");
					}
				}
			},

			methods: {
				init: function() {

				},
				initDd: function(e, btn, dd) {

					/* trigger the required event handler (click or mouseover) */
					var isEvent = (btn.attr("data-event") === e.type);

					/* detect if an item is clicked */
					var isItem = _(e.target).hasClass('dd-item') || _(e.target).parent().hasClass('dd-item');

					if(isEvent && dd && !isItem) {

						/* dropdown status  */
						var isOpen = dd.hasClass('open'),
							isDisabled = btn.hasClass("btn-disabled"),
							isloading = btn.hasClass("btn-loading"),
							target = _(e.target)
							;

						/* if the dropdown button is not disabled or not loading */
						if(!isDisabled && !isloading) {

							/* if the dropdown is not open */
							if(!isOpen) {

								me.methods.openDd(btn, dd);

							} else if(target.hasClass('dd-btn') || target.parents('.dd-btn').length > 0) {
								/* close dropdown like a toggle event only on click */
								if(e.type === "click") {

									me.methods.closeDd(btn, dd);
								}
							}
						}

						/* Broadcast custom parameter on dropdown list openning */
						if(typeof btn.attr('data-custom-param') !== 'undefined' && !isOpen) {
							app.notify('share btn through apps', btn);
						}

						return false;
					}
				},
				openDd: function(btn, dd) {
					btn.addClass("active");
					dd.addClass("open");
				},
				closeDd: function(btn, dd) {
					btn.removeClass("active");
					dd.removeClass("open");
				}
			}
		};
	}
});
