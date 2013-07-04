tetra.controller.register('popin', {
	scope: 'popin',
	use: ['popin'],

	constr: function(me, app, page, orm) {

		'use strict';

		return {
			events: {
				model: { // events received from model
					'popin': { // model name

						'fetch': function() {
							app.notify('start loading');
						},
						'append': function(col) {

							var data = {
								html: col[0].get('html'),
								url: col[0].get('id'),
								_timestamp: col[0].get('timestamp')
							};

							app.notify('end loading').notify('set content', {
								content: data.html
							});

							page.notify("popin: success", data);
						},
						'error': function(error) {
							app.notify('end loading').notify('show error', error);
						}
					}
				},

				view: {
					'popin: set content': function(data) {

						me.methods.setContent(data);

					},

					'popin: close': function() {

						app.notify('clear', {
							url: me.url,
							id: me.id
						});

					},

					'popin: closed': function(data) {

						page.notify('popin: closed', data);

					}
				},

				controller: {
					'popin: loading': function() {
						app.notify('start loading');
					},
					'popin: set content': function(data) {
						me.methods.setContent(data);
					},
					'popin: close': function() {
						app.notify('clear', {
							url: me.url,
							id: me.id
						});
					},
					'popin: fadeout': function() {

						app.notify('fadeout', {
							url: me.url,
							id: me.id
						});

						window.setTimeout(function() {
							app.notify('clear', {
								url: me.url,
								id: me.id
							});
						}, 300);

					},
					'popin: show loader': function() {
						app.notify('show loader');
					},
					'popin: hide loader': function() {
						app.notify('hide loader');
					}
				}
			},

			methods: {
				init: function() {
					me.id = null;
					me.url = null;
				},

				setContent: function(data) {

					data._timestamp = (new Date()).getTime();

					if(data.url) { // loading popin with ajax

						me.url = data.url;
						me.id = null;
						orm('popin').fetch({
							uriParams: { url: data.url },
							timestamp: data._timestamp
						});

					} else if(data.id) { // loading popin from the dom

						me.id = data.id;
						me.url = null;
						app.notify('start loading').notify('load from dom', data.id);
						page.notify("popin: success", data);

					} else if(data.html) { // updating with html content

						me.id = null;
						me.url = null;
						app.notify('start loading').notify('set content', {
							content: data.html
						});
						page.notify("popin: success", data);

					}

				}
			}
		};
	}
});
