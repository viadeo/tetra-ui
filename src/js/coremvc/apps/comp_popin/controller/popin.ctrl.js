tetra.controller.register('popin', {
	scope: 'comp_popin',
	use: ['popin'],
	
	constr: function(me, app, page, orm) {
		return {
			events: {
				model: { // events received from model
					'popin': { // model name
						
						'fetch': function(obj) {
							
							app.notify('start loading');
							
						},
						'append': function(col) {
							
							app.notify('end loading').notify('set content', {
								content : col[0].get('html')
							});
							
							page.notify("popin: success", col[0].get('html'));
						},
						'error': function(error) {
							
							app.notify('end loading').notify('show error');
							
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
						
					}
				},
				
				controller: {
					'popin: loading': function(data) {
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
					
					if (data.url) { // loading popin with ajax
						
						me.url = data.url;
						me.id = null;
						orm('popin').fetch({ uriParams: { url: data.url } });
						
					} else if (data.id) { // loading popin from the dom
						
						me.id = data.id;
						me.url = null;
						app.notify('start loading').notify('load from dom', data.id);
						page.notify("popin: success", data);
						
					} else if (data.html) { // updating with html content

						me.id = null;
						me.url = null;
						app.notify('start loading').notify('set content', {
							content : data.html
						});
						page.notify("popin: success", data);
						
					}
					
				}
			}
		};
	}
});
