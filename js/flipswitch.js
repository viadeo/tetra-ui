/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register('flipswitch', {
	scope: 'flipswitch',

	constr: function(me, app, page) {

		'use strict';

		return {
			events: {
				view: {
					'change flipswitch state': function(data) {
						page.notify('flipswitch: set state', {
							id: data.id,
							state: !data.state
						});
					}
				},

				controller: {
					'flipswitch: set state': function(data) {
						app.notify('set state', {
							id: data.id,
							state: data.state
						});
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

tetra.view.register('flipswitch', {
	scope: 'flipswitch',
	use: ['flipswitch'],

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.flipswitch-lbl-yes': function(e, elm) {

							var container = elm.parents('.flipswitch');

							app.notify('change flipswitch state', {
								id: container.attr('id'),
								state: false
							});

						},

						'.flipswitch-lbl-no': function(e, elm) {

							var container = elm.parents('.flipswitch');

							app.notify('change flipswitch state', {
								id: container.attr('id'),
								state: true
							});

						},

						'.flipswitch-sliders': function(e, elm) {

							var container = elm.parents('.flipswitch');

							app.notify('change flipswitch state', {
								id: container.attr('id'),
								state: !container.hasClass('flipswitch-no')
							});

						}
					}
				},

				controller: {
					'set state': function(data) {
						var container = _('#' + data.id);
						var yes = container.find('.flipswitch-lbl-yes input');
						var no = container.find('.flipswitch-lbl-no input');

						if(data.state) {
							container.removeClass('flipswitch-no');
							container.addClass('flipswitch-yes');
							yes.prop('checked', true);
							no.prop('checked', false);
						} else {
							container.removeClass('flipswitch-yes');
							container.addClass('flipswitch-no');
							yes.prop('checked', false);
							no.prop('checked', true);
						}

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
