core.view.register('navtabs', {
	scope: 'comp_navtabs', // application name
	use: ['navtabs'], // list of required controllers
	
	constr: function(me, app, _) {
		return {
			events: {
				user: { // list of events listened on the page
					'click': {
						'.nav-tabs a': function(e, elm) {
							var data = {
								url: _(elm).attr('href'),
								targetId : _(elm).parents('.nav-tabs').attr('data-target-id')
							};
							
							me.methods.setActiveTab(elm);
							app.notify('show tab', data);
						}
					}
				},
				
				controller: { // list of messages sent by controllers listened in the view
					'start loading': function(data) {
						_('#' + data.targetId).addClass('loading');
					},
					'end loading': function(data) {
						_('#' + data.targetId).removeClass('loading');
					},
					'set content': function(data) { // function executed at the reception
						
						_('#' + data.targetId).children('.section').html(data.content);
						var elm = _('.nav-tabs[data-target-id=' + data.targetId + ']').find('a[href="' + data.tabRef + '"]');
						me.methods.setActiveTab(elm);
					},
					'show error': function(error) {
						VNS.ui.growl(lang['notification.modification.save.error']);
					}
				}
			},
			
			methods: {
				init: function() {
					me.target = undefined;
					me.tabs = undefined;
				},
				setActiveTab: function(elm) {
					_(elm).parent().addClass('active').siblings().removeClass('active');
				}
			}
		};
	}
});
