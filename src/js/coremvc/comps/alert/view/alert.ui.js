tetra.view.register('alert', {
	scope: 'alert',

	constr: function(me, app, _) {
		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.bx-alert-close': function(e, elm) {
							_(elm).parents('.bx-alert').remove();
						},

						'.bx-close': function(e, elm) {
							_(elm).parents('.bx').remove();
						}
					}
				},

				controller: {}
			},

			methods: {
				init: function() {
				}
			}
		};
	}
});
