tetra.controller.register('popin', {
	scope: 'comp_popin',
	use: ['popin'],
	
	constr: function(me, app, page, orm) {
		return {
			events: {
				model: { // events received from model
					'popin': { // model name
						
						'update': function(obj) {
							
							app.notify('start loading');
							
						},
						'stored': function(obj) {
							
							app.notify('end loading').notify('set content', {
								content : obj.get('html')
							});
							
							page.notify("popin: success", obj);
						},
						'error': function(error) {
							
							app.notify('end loading').notify('show error');
							
						}
					}
				},
				
				view: { // events received from view or third party controllers
					'popin: loading': function(data) {
						app.notify('start loading');
					},
					'popin: set content': function(data) {
						
						if (data.url) { // loading popin with ajax
							
							me.url = data.url;
							me.id = null;
							orm('popin').create(data).save({ uriParams: { url: data.url } });
							
						} else if (data.id) { // loading popin from the dom
							
							me.id = data.id;
							me.url = null;
							app.notify('start loading').notify('load from dom', data.id);
							
						} else if (data.html) { // updating with html content
							
							me.id = null;
							me.url = null;
							app.notify('end loading').notify('set content', {
								content : data.html
							});
							
						}
						
					},
					'popin: close': function() {
						
						app.notify('clear', {
							url: me.url,
							id: me.id
						});
						
					}
				}
			},
			
			methods: {
				init: function() {
					me.id = null;
					me.url = null;
				}
			}
		};
	}
});
