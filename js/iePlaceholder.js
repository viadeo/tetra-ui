/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.view.register('iePlaceholder', {
	scope: "ie",
	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					"focus": {
						"input.ie-ph,textarea.ie-ph": function(e, elm) {
							if(!me._phSupport && elm.val() === elm.attr('placeholder')) {
								elm.val('').removeClass('default');
							}
						}
					},

					"blur": {
						"input.ie-ph,textarea.ie-ph": function(e, elm) {
							if(!me._phSupport && elm.val() === '') {
								/* add a delay : prevent sending placeholder as a field value */
								setTimeout(function() {
									elm.val(elm.attr('placeholder')).addClass('default');
								}, 100);
							}
						}
					}
				}
			},

			methods: {
				init: function() {

					var
						inputs = _("input.ie-ph,textarea.ie-ph"),
						i = 0,
						len = inputs.length
						;

					me._phSupport = (function() {
						var input = document.createElement('input');
						return ('placeholder' in input);
					})();

					if(!me._phSupport) {
						if(len > 0) {
							for(; i < len; i++) {
								var input = _(inputs[i]);
								if(!me._phSupport && input.val() === '') {
									input.val(input.attr('placeholder')).addClass('default');
								}
							}
						}
					}
				}
			}
		};
	}
});