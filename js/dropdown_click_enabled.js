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

tetra.view.register('click_enabled', {
	scope: 'dropdown',
	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.dd-btn': function(e, elm) {
							var dd = elm.parents('.dd');
							//duplicate callback on dd parent and store a copy of it in a custom attribute
							var callbackReference = _(elm).attr('class').replace(/^.*\b(clickout-\d+)\b.*$/, "$1");
							_(elm).attr('data-dropdown-callback', callbackReference);
							_(dd).addClass(callbackReference);
							me.methods.initDd(e, elm, dd);
						}

					},
					'mouseover': {
						'.dd': function(e, elm) {
							var btn = elm.find(".dd-btn:first");
							me.methods.initDd(e, btn, elm);
						}

					},
					'clickout': {
						'.dd-btn': function(e, elm) {
							var dd = elm.parents('.dd');

							/* prevent conflict on multi event handler */
							if(elm.attr("data-event") === "click") {
								if(0 === _(e.target).parents('.dd.' + _(elm).attr('data-dropdown-callback')).length) {
									_(e.target).parents('.dd.' + _(elm).attr('data-dropdown-callback')).removeClass(_(elm).attr('data-dropdown-callback'));
									_(elm).removeAttr('data-dropdown-callback');
									me.methods.closeDd(elm, dd);
								}
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
				controller: {}
			},

			methods: {
				init: function() {
				},
				initDd: function(e, btn, dd) {
					/* trigger the required event handler (click or mouseover) */
					var isEvent = (btn.attr("data-event") === e.type);

					if(isEvent && dd) {

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
