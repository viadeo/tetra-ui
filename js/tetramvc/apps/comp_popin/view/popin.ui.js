tetra.view.register('popin', {
	scope: 'comp_popin',
	use: ['popin'],
	
	constr: function(me, app, _) {
		return {
			events: {
				user: {
					'click': {
						'[data-popin]': function(e, elm) {
							
							if (elm.attr('data-popin') == 'show') {
								
								if (elm.attr('data-target-url')) {
									
									app.notify('popin: set content', {
										url: elm.attr('data-target-url')
									});
									
								} else if (elm.attr('data-target-id')) {
									
									app.notify('popin: set content', {
										id: elm.attr('data-target-id')
									});
									
								}
								
							} else if (elm.attr('data-popin') == 'close') {
								
								app.notify('popin: close');
								
							}
							
						}
					}
				},
				
				controller: {
					'start loading': function() {
						me.methods.clear();
						_('body').append('<div class="popin-overlay"></div><div class="popin-container"><span class="popin-loader"></span></div>');
					},
					'end loading': function() {
					},
					'set content': function(data) {
						_('body .popin-container').html(data.content);
					},
					'show error': function(error) {
						me.methods.clear();
						VNS.ui.growl(lang['notification.modification.save.error'],{type:'warn'});
					},
					'clear': function(data) {
						if (data.id) { // putting back the popin content to where it was in the dom
							var content = _('body .popin-container').html();
							me.methods.clear();
							_('#' + data.id).html(content);
						} else {
							me.methods.clear();
						}
					},
					'load from dom': function(id) {
						var content = _('#' + id).html();
						_('#' + id).empty();
						_('body .popin-container').html(content);
					}
				}
			},
			
			methods: {
				init: function() {
				},
				clear: function() {
					_('.popin-container').remove();
					_('.popin-overlay').remove();
				}
			}
		};
	}
});
