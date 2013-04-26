/*! Tetra UI v1.0.30 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.view.register('placeholder', {
	scope: 'placeholder',

	constr: function(me, app, _) {
		'use strict';

		return {
			events: {
				user: {

					'click': {
						'.placeholding': function(e, elm) {
							_(elm).addClass('active');
						}
					},

					'clickout': {
						'.placeholding': function(e, elm) {
							_(elm).removeClass('active');
						}
					},

					'focus': {
						'.placeholding input': function(e, elm) {
							_(elm).parent().addClass('active');
						}
					},

					'blur': {
						'.placeholding input': function(e, elm) {
							_(elm).parent().removeClass('active');
						}
					},

					'keyup': {
						'.placeholding input': function(e, elm) {
							var placeholding = _(elm).parent();
							var typed = _(elm).val().length;

							if(typed > 0) {
								if(!placeholding.hasClass('typing')) {
									placeholding.addClass('typing');
								}
							} else {
								placeholding.removeClass('typing');
							}
						}
					}

				},

				controller: {}
			},

			methods: {
				init: function() {

					_(document).ready(function() {
						var fields = _('.placeholding input');

						for(var i = 0; i < fields.length; i++) {
							var input = fields[i];
							if(_(input).val().length > 0) {
								_(input).parent().addClass('typing');
							}
						}
					});

				}
			}
		};
	}
});
