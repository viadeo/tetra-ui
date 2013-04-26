tetra.controller.register('autocomplete', {
	scope: 'generic_autocomplete',
	use: ['autocomplete'],

	constr: function(me, app, page, orm) {

		'use strict';

		return {
			events: {

				model: {
					'autocomplete': {
						'append': function(col) {
							app.notify('display suggestions', col[0].get('completion'));
						}
					}
				},

				view: {

					'do query': function(data) {
						data.uriParams = {
							url: data.url
						};
						me.methods.startCountDown(function() {
							orm('autocomplete').fetch(data);
						}, data.typingDelay);
					},
					'autocompleteGeneric : click on suggestion': function(elm) {
						page.notify('autocompleteGeneric : click on suggestion', elm);
					}
				}
			},
			methods: {
				init: function() {
					me.defaultTypingDelay = 150; // default delay before sending server-side request
				},
				startCountDown: function(callback, delay) {
					// it is considered that user types only one field at a time, so no need to consider origin
					// cancel previous counter if it exists
					if(me.countDown) {
						window.clearTimeout(me.countDown);
					}
					// updates typing delay if not specified
					delay = delay || me.defaultTypingDelay;
					// set a new counter
					me.countDown = window.setTimeout(callback, delay);
				}
			}

		};
	}
});
