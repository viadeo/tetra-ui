tetra.view.register('card', {
	scope: 'card',

	constr: function(me, app, _) {
		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.bx-flip .bx-flip-turn': function (e, elm) {
							_(elm).parents('.bx-flip').first().toggleClass('bx-flip-flipped');
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
