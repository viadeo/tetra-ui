tetra.view.register('navtabs', {
	scope: 'navtabs', // application name
	use: ['navtabs'], // list of required controllers

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: { // list of events listened on the page
					'click': {
						'.nav a[data-href]': function(e, elm) {
							var data = {
								url: elm.attr('data-href'),
								targetId: elm.parents('.nav').attr('data-target-id')
							};

							me.methods.setActiveTab(elm);
							app.notify('show tab', data);
						},

						'.nav a[data-section]': function(e, elm) {
							var targetId = elm.parents('.nav').attr('data-target-id');
							_('#' + targetId).find('.section').removeClass('active');
							_('#' + elm.attr('data-section')).addClass('active');
							me.methods.setActiveTab(elm);
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
						var elm = _('.nav-tabs[data-target-id=' + data.targetId + ']').find('a[data-href="' + data.tabRef + '"]');
						me.methods.setActiveTab(elm);
					},
					'show error': function(error) {
						VNS.ui.growl(lang['notification.modification.save.error']);
					}
				}
			},

			methods: {
				init: function() {
					_('.nav-tabs li.active a').click();
				},
				setActiveTab: function(elm) {
					elm.parent().addClass('active').siblings().removeClass('active');
				}
			}
		};
	}
});
