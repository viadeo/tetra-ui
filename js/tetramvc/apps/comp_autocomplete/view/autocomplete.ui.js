tetra.view.register('autocomplete', {
	scope: 'comp_autocomplete',
	use: ['autocomplete'], // required controllers
	
	constr: function(me, app, _) {
		return {
			events: {
				user: { // events listened on the page
					'keydown': {
						'.autocomplete input': function(e, elm) {
							
							var container = elm.parents('.autocomplete');
							
							switch (e.which) {
							
							case 13: // enter
								e.preventDefault();
								
								app.notify('autocomplete: set value', {
									value: container.find('.autocomplete-menu li.active').attr('data-value'),
									id: container.attr('id')
								});
								
								break;
							
							case 38: //	 up
							case 40: // down
								e.preventDefault();
								break;
							}
						}
					},
					
					'keyup': {
						'.autocomplete input': function(e, elm) {
							
							var container = elm.parents('.autocomplete');
							
							switch (e.which) {
							
							case 37: // left
							case 39: // right
								if (! container.hasClass('active')) {
									app.notify('autocomplete: show', {
										url: elm.attr('data-url'),
										param: elm.val(),
										id: container.attr('id')
									});
								}
								break;
								
							case 13: // enter
								break;
								
							case 27: // esc
								me.methods.menuHide(container);
								break;
								
							case 38: // up
								me.methods.menuGo(container, -1);
								break;
							
							case 40: // down
								me.methods.menuGo(container, 1);
								break;
							
							default:
								if (elm.val().length >= parseInt(elm.attr('data-min-length'))) {
									app.notify('autocomplete: show', {
										url: elm.attr('data-url'),
										param: elm.val(),
										id: container.attr('id')
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
								me.methods.menuHide(container);
							}, 200);
							
						}
					},
					
					'click': {
						'.autocomplete .autocomplete-menu li': function(e, elm) {
							
							var container = elm.parents('.autocomplete');
							
							app.notify('autocomplete: set value', {
								value: elm.attr('data-value'),
								id: container.attr('id')
							});
							
						}
					}
				},
				
				controller: { // messages sent by controllers
					
					'autocomplete: display completion': function(data) {
						var container = _('#' + data.id);
						var menu = container.find('.autocomplete-menu');
						
						app.exec('completion', data, function(html) {
							_(menu).html(html);
						});
						
						menu.find('li:first-child').addClass('active');
						container.addClass('active');
					},
					
					'autocomplete: display value': function(data) {
						var container = _('#' + data.id);
						container.find('input').val(data.value);
						me.methods.menuHide(container);
					}
					
				}
			},
			
			methods: {
				init: function() {
				},
				menuGo: function(container, direction) {
					var items = container.find('.autocomplete-menu li');
					
					var index = items.filter('.active').removeClass('active').index();
					index += direction;
					if (index >= items.length) {
						index = 0;
					}

					items.eq(index).addClass('active');
				},
				menuHide: function(container) {
					container.removeClass('active');
				}
			}
		};
	}
});
