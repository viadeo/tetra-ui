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
