tetra.view.register('alert', {
	scope: 'alert',

	constr: function(me, app, _) {
		'use strict';

		return {
			events: {
				user: {
					'click':{
						'.bx-alert-close': function (e, elm) {
							elm.parents('.bx-alert').remove();
						}
					}
				},

				controller: {}
			},

			methods:{
				init: function () {}
			}
		};
	}
});
