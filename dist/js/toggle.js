/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register('toggle', {
	scope: 'toggle',

	constr: function(me, app, page, orm) {

		'use strict';

		return {
			events: {
				view: {
					'change toggle state': function(data) {

						app.notify('set state', {
							id: data.id,
							state: !data.state
						});

					},

					'toggle state changed': function(data) {

						page.notify('toggle: state changed', {
							id: data.id,
							state: data.state
						});

					}
				},

				controller: {
					'toggle: set state': function(data) {

						app.notify('set state', {
							id: data.id,
							state: data.state
						});

					},

					'toggle: invert state': function(data) {

						app.notify('invert state', {
							id: data.id
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

tetra.view.register('toggle', {
	scope: 'toggle',
	use: ['toggle'],

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.btn-toggle': function(e, elm) {

							app.notify('change toggle state', {
								id: elm.attr('id'),
								state: elm.hasClass('btn-toggle-checked')
							});

						}
					}
				},

				controller: {
					'set state': function(data) {
						var container = _('#' + data.id);
						var checkbox = container.find('input');

						if(data.state) {
							container.addClass('btn-toggle-checked');
						} else {
							container.removeClass('btn-toggle-checked');
						}

						checkbox.prop('checked', data.state);

						app.notify('toggle state changed', {
							id: data.id,
							state: data.state
						});
					},

					'invert state': function(data) {
						var container = _('#' + data.id);
						var checkbox = container.find('input');

						container.toggleClass('btn-toggle-checked');
						checkbox.prop('checked', !checkbox.prop('checked'));

						app.notify('toggle state changed', {
							id: data.id,
							state: checkbox.prop('checked')
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
