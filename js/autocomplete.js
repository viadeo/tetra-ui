/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

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

tetra.view.register('autocomplete', {
	scope: 'autocomplete',
	use: ['autocomplete'],

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: { // events listened on the page
					'keydown': {
						'.autocomplete input': function(e, elm) {
							var container = elm.parents('.autocomplete');

							switch(e.which) {
								case 13: // enter
									e.preventDefault(); // avoid enter to allow form submit

									var active = container.find('.autocomplete-menu li.active');

									app.notify('select suggestion', {
										value: active.attr('data-value'),
										id: container.attr('id'),
										ref: active.attr('data-ref')
									});

									break;

								case 38: // up
								case 40: // down
									e.preventDefault();
									break;
							}
						}
					},

					'keyup': {
						'.autocomplete input': function(e, elm) {
							var container = elm.parents('.autocomplete');

							switch(e.which) {
								case 37: // left
								case 39: // right
									if(!container.hasClass('active')) {
										app.notify('do query', {
											url: container.attr('data-url'),
											param: elm.val(),
											id: container.attr('id')
										});
									}
									break;

								case 13: // enter
									break;

								case 27: // esc
									me.methods.suggestions.hide(container.attr('id'));
									break;

								case 38: // up
									me.methods.suggestions.select(container.attr('id'), 'previous');
									break;

								case 40: // down
									me.methods.suggestions.select(container.attr('id'), 'next');
									break;

								default:
									if(elm.val().length >= parseInt(container.attr('data-min-length'), 10)) {
										app.notify('do query', {
											url: container.attr('data-url'),
											param: elm.val(),
											id: container.attr('id'),
											typingDelay: container.attr('data-typing-delay') || undefined
										});
									}
									break;
							}
						}
					},

					'blur': {
						'.autocomplete input': function(e, elm) {

							var container = elm.parents('.autocomplete');

							window.setTimeout(function() {
								me.methods.suggestions.hide(container.attr('id'));
							}, 200);

						}
					},

					'click': {
						'.autocomplete .autocomplete-menu li': function(e, elm) {

							var container = elm.parents('.autocomplete');

							app.notify('select suggestion', {
								value: elm.attr('data-value'),
								id: container.attr('id'),
								ref: elm.attr('data-ref')
							});

						}
					}
				},

				controller: {

					'display suggestions': function(suggestionsPack) {
						var container = _('#' + suggestionsPack.suggestions.id);
						var menu = container.find('.autocomplete-menu');

						_.each(suggestionsPack.suggestions.data, function(key, value) {
							value.ref = suggestionsPack.ref + ':' + key;
						});

						app.exec(container.attr('data-template-id'), suggestionsPack.suggestions, function(html) {
							_(menu).html(html);
						});

						// testing if we must select the first item by default
						if (! container.attr('data-no-default')) {
							menu.find('li:first-child').addClass('active');
						}

						container.addClass('active');
					},

					'display value': function(data) {
						var container = _('#' + data.id);
						container.find('input').val(data.value);
						me.methods.suggestions.hide(data.id);
					}

				}
			},

			methods: {
				suggestions: {
					select: function(containerId, direction) {
						var items = _('#' + containerId).find('.autocomplete-menu li');
						var index = items.filter('.active').removeClass('active').index();

						index += (direction === 'next') ? 1 : -1;

						if (index >= items.length) {
							index = 0;
						} else if (index < -1) {
							index = items.length - 1;
						}

						items.eq(index).addClass('active');
					},

					hide: function(containerId) {
						_('#' + containerId).removeClass('active');
					}
				}
			}
		};
	}
});
