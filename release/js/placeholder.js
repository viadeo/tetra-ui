/*! Tetra UI v1.0.17 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.view.register('placeholder', {
	scope: 'placeholder',

	constr: function(me, app, _) {
		'use strict';

		return {
			events: {
				user: {

					'click': {
						'.placeholding': function(e, elm) {
							elm.addClass('active');
						}
					},

					'clickout': {
						'.placeholding': function(e, elm) {
							elm.removeClass('active');
						}
					},

					'focus': {
						'.placeholding input': function(e, elm) {
							elm.parent().addClass('active');
						}
					},

					'blur': {
						'.placeholding input': function(e, elm) {
							elm.parent().removeClass('active');
						}
					},

					'keyup': {
						'.placeholding input': function(e, elm) {
							var placeholding = elm.parent();
							var typed = elm.prop('value').length;

							if (typed > 0) {
								if (! placeholding.hasClass('typing')) {
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

			methods:{
				init: function() {

					_(document).ready(function() {
						_('.placeholding input').each(function() {
							if (_(this).prop('value').length > 0) {
								_(this).parent().addClass('typing');
							}
						});
					});

				}
			}
		};
	}
});
