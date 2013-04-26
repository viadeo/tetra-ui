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
