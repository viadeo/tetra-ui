/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.model.register('navtabs', {
	scope: "navtabs",

	req: {
		fetch: {
			url: '{0}',
			uriParams: ['url'],
			parser: function(resp, col, cond) {
				col[cond.uriParams.url] = {id: cond.uriParams.url, targetId: cond.targetId, html: resp.toString()};
				return col;
			}
		}
	},

	attr: {
		html: '',
		targetId: ''
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			}
		};
	}

});
tetra.controller.register('navtabs', {
	scope: 'navtabs', // application name
	use: ['navtabs'], // list of required models

	constr: function(me, app, page, orm) {

		'use strict';

		return {
			events: {
				model: { // events received from model
					'navtabs': { // model name

						'append': function(col) {
							var obj = col[0];
							me.currentContent = obj.get('html');
							app
								.notify('end loading', {
									targetId: obj.get('targetId')
								})
								.notify('set content', {
									targetId: obj.get('targetId'),
									content: me.currentContent,
									tabRef: me.tabRef[me.tabRef.length - 1]
								})
							;
						},
						'error': function(error) {

							me.tabRef.pop();

							app
								.notify('end loading', {
									targetId: error.obj.get('targetId')
								})
								.notify('show error')
								.notify('set content', {
									targetId: error.obj.get('targetId'),
									content: me.currentContent,
									tabRef: me.tabRef[me.tabRef.length - 1]
								})
							;
						}
					}
				},

				view: { // events received from view
					'show tab': function(data) {

						me.tabRef.push(data.url);

						app.notify('start loading', {
							targetId: data.targetId
						});

						data.uriParams = { url: data.url };
						orm('navtabs').fetch(data);

					}
				}
			},

			methods: {
				init: function() {
					me.currentContent = '';
					me.tabRef = [];
				}
			}
		};
	}
});

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
