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
