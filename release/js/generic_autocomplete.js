/*! Tetra UI v1.0.31 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.model.register('autocomplete', {
	scope: 'generic_autocomplete',

	req: {
		fetch: {
			url: '{0}',
			uriParams: ['url'],
			parser: function(resp, col, cond) {
				resp.id = cond.id;
				col[cond.uriParams.url] = {
					id: cond.id,
					completion: resp
				};
				return col;
			}
		}
	},

	attr: {
		completion: {}
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			}
		};
	}

});

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

tetra.view.register('autocomplete', {
	scope: 'generic_autocomplete',
	use: ['autocomplete'], // required controllers

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: { // events listened on the page
					'keydown': {
						'.autocomplete input': function(e, elm) {
							me.methods.reinit(elm);
							switch(e.which) {

								case 13: // enter
									elm = me._container.find('.autocomplete-menu li.active');
									if(elm.length) {
										// avoid enter to allow form submit
										e.preventDefault();
										me.methods.suggestions.clickOnSuggestion(elm);
									}
									me.methods.suggestions.hide(me._container);

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
							me.methods.reinit(elm);
							switch(e.which) {

								case 37: // left
								case 39: // right
									if(!me._container.hasClass('active')) {
										me.methods.suggestions.doQuery(elm, false);
									}
									break;

								case 13: // enter
									break;

								case 27: // esc
									me.methods.suggestions.hide(me._container);
									break;

								case 38: // up
									me.methods.suggestions.select('previous');
									break;

								case 40: // down
									me.methods.suggestions.select('next');
									break;

								default:
									if(elm.val().length >= parseInt(me._container.attr('data-min-length'), 10)) {
										me.methods.suggestions.doQuery(elm, true);
									}

									if(!elm.val().length) {
										me.methods.suggestions.hide(me._container);
									}

									break;
							}
						}
					},

					'focus': {
						'.autocomplete input': function(e, elm) {
							me._container = null;
							me.methods.reinit(elm);
							if(elm.val().length >= parseInt(me._container.attr('data-min-length'), 10)) {
								me.methods.suggestions.doQuery(elm, true);
							}
						}
					},

					'blur': {
						'.autocomplete input': function(e, elm) {
							me.methods.reinit(elm);
							window.setTimeout(function() {
								me.methods.suggestions.hide(me._container);
							}, 200);
						}
					},

					'click': {
						'.autocomplete .autocomplete-menu li': function(e, elm) {
							me.methods.suggestions.clickOnSuggestion(elm);
							me.methods.suggestions.hide(me._container);
						}
					}
				},

				controller: {

					'display suggestions': function(suggestionsPack) {
						// Check if the response contains one or many suggestions
						var hasSuggestion;
						for(var suggestion in suggestionsPack.data.completion) {
							hasSuggestion = true;
							break;
						}

						if(hasSuggestion) {
							var suggestions = {
								data: suggestionsPack.data.completion,
								query: _.trim(me._input.val())
							};
							app.exec(me._templateRef, suggestions, function(html) {
								me._menu.html(html);
							});

							me._menu.find('li:first-child').addClass('active');
							me._container.addClass('active');
						} else {
							me._container.removeClass('active');
							me._menu.empty();
						}
					},

					'display value': function(data) {
						me._input.val(data.value);
						me.methods.suggestions.hide(me._container);
					}
				}
			},

			methods: {

				init: function() {
					me._param = '%param%';
					me._container = null;
				},

				reinit: function(elm) {
					if(!me._container) {
						me._container = _(elm.parents('.autocomplete')[0]);
						me._paramName = me._container.attr('data-param') || 'param';
						me._input = me._container.find('input');
						me._menu = me._container.find('#' + me._container.attr('data-suggest-container-id'));
						me._templateRef = me._container.attr('data-suggest-template-ref');

						if(!_('#tmpl_' + me._templateRef).length) {
							me._templateRef = me._templateRef.substring(0, me._templateRef.indexOf('_')) + '_1';
						}
					}
				},

				suggestions: {
					select: function(direction) {
						var items = me._container.find('.autocomplete-menu li');
						var index = items.filter('.active').removeClass('active').index();
						index += (direction === 'next') ? 1 : -1;
						if(index >= items.length) {
							index = 0;
						}
						items.eq(index).addClass('active');
					},

					hide: function(container) {
						container.removeClass('active');
					},

					replaceParam: function(url, param) {
						return url.replace(me._param, param);
					},

					clickOnSuggestion: function(elm) {
						var value = _.trim(elm.find('.value').text());
						if(value && value.length > 0) {
							me._input.val(value);
						}
						app.notify('autocompleteGeneric : click on suggestion', elm[0]);
						me._container = null;
					},

					doQuery: function(elm, delay) {
						var param = elm.val();
						var url = me.methods.suggestions.replaceParam(me._container.attr('data-url'), param);
						var data = {
							url: url,
							id: me._container.attr('id'),
							typingDelay: me._container.attr('data-typing-delay')
						};
						data[me._paramName] = param;

						// PARTICULAR CASES
						var form = _(_(elm.parents('.core-form'))[0]);
						if(elm.hasClass('schoolDepartment')) {
							form.find('#schoolId').val('');
							data.itemName = form.find('.autocompleteSchool').val();
							if(data.itemName.blank()) {
								return;
							}
							data.town = form.find('input.town').val();
						} else if(elm.hasClass('autocompleteSchool')) {
							form.find('#schoolId').val('');
							form.find('input.town').val('');
						}
						app.notify('do query', data);
					}
				}
			}
		};
	}
});