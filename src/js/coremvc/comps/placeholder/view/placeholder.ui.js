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
							if (_(this).val().length > 0) {
								_(this).parent().addClass('typing');
							}
						});
					});

				}
			}
		};
	}
});
