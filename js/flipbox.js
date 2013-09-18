/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.view.register('flipbox', {
	scope: 'flipbox',

	constr: function(me, app, _) {
		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.bx-flip .bx-flip-turn': function(e, elm) {
							_(elm).parents('.bx-flip').first().toggleClass('bx-flip-flipped');
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
