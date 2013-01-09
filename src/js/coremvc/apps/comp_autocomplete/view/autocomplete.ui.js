tetra.view.register('autocomplete', {
	scope: 'comp_autocomplete',
	use: ['autocomplete'], // required controllers
	
	constr: function(me, app, _) {
		return {
			events: {
				user: { // events listened on the page
					'keydown': {
						'.autocomplete input': function(e, elm) {

							var
								container = elm.parents('.autocomplete'),
								containerId = container.attr('id')
							;
							
							switch (e.which) {
							
								case 13: // enter
									// avoid enter to allow form submit
									e.preventDefault();
									var elm = container.find('.autocomplete-menu li.active');
									app.notify('select suggestion', {
										value: elm.attr('data-value'),
										id: containerId,
                                                                		ref: elm.attr('data-ref')
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
							
							var
                                                                container = elm.parents('.autocomplete'),
                                                                containerId = container.attr('id')
                                                        ;							

							switch (e.which) {
							
								case 37: // left
								case 39: // right
									if (! container.hasClass('active')) {
										app.notify('do query', {
											url: elm.attr('data-url'),
											param: elm.val(),
											id: container.attr('id')
										});
									}
									break;
									
								case 13: // enter
									break;
									
								case 27: // esc
									me.methods.suggestions.hide(containerId);
									break;
									
								case 38: // up
									me.methods.suggestions.select(containerId, 'previous');
									break;
								
								case 40: // down
									me.methods.suggestions.select(containerId, 'next');
									break;
								
								default:
									if (elm.val().length >= parseInt(elm.attr('data-min-length'))) {
										app.notify('do query', {
											url: elm.attr('data-url'),
											param: elm.val(),
											id: containerId,
											typingDelay : elm.attr('data-typing-delay') || undefined	
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

						var
							container = _('#' + suggestionsPack.suggestions.id),
							input = container.find('input'),
							menu = container.find('#' + input.attr('data-suggest-container-id')),
							templateRef = input.attr('data-suggest-template-ref')
						;
						
						_.each(suggestionsPack.suggestions.data, function(key, value){value.ref = suggestionsPack.ref + ':' + key});

						app.exec(templateRef, suggestionsPack.suggestions, function(html) { _(menu).html(html); });
						
						menu.find('li:first-child').addClass('active');
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
				suggestions : {
					select : function(containerId, direction) {
                                        	var items = _('#' + containerId).find('.autocomplete-menu li');
                                        	var index = items.filter('.active').removeClass('active').index();
                                        		index += (direction == 'next') ? 1 : -1;
                                        		if (index >= items.length) {
                                        		index = 0;
                                        	}
                                        	items.eq(index).addClass('active');
                                	},
					hide : function(containerId) {
                                 	       _('#' + containerId).removeClass('active');
                                	}
				}
			}
		};
	}
});
