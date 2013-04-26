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
