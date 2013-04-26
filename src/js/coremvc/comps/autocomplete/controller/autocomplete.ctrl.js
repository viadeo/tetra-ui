tetra.controller.register('autocomplete', {
	scope: 'autocomplete',
	use: ['suggestions'],

	constr: function(me, app, page, orm) {

		'use strict';

		return {
			events: {
				model: {
					'suggestions': {
						'append': function(col) {
							app.notify('display suggestions', col[0].getAll());
						}
					}
				},

				view: {
					'do query': function(data) {
						me.methods.startCountDown(function(data) {
							orm('suggestions').select({
								param: data.param,
								uriParams: {
									url: data.url
								},
								id: data.id
							});
						}, data);
					},

					'select suggestion': function(data) {
						var packRef = data.ref.split(':')[0];
						var objRef = data.ref.split(':')[1];

						orm('suggestions').findByRef(packRef, function(pack) {
							page.notify('autocomplete: item selected', {
								obj: pack.get('suggestions').data[objRef],
								origin: data.id
							});
						});

						app.notify('display value', data);
					}
				}
			},

			methods: {
				init: function() {
					me.defaultTypingDelay = 150; // default delay before sending server-side request
					me.countDown = null;
				},

				startCountDown: function(callback, data) {
					// it is considered that user types only one field at a time, so no need to consider origin
					// cancel previous counter if it exists
					if(me.countDown) {
						window.clearTimeout(me.countDown);
					}

					// updates typing delay if precised
					var typingDelay = (typeof data.typingDelay !== 'undefined') ? data.typingDelay : me.defaultTypingDelay;

					// set a new counter
					// IE versions 7, 8, 9 don't support sending additional parameters in setTimeout
					// so we use another anonymous function
					me.countDown = window.setTimeout(function() {
						callback(data);
					}, typingDelay);
				}
			}
		};
	}
});
