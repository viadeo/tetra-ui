tetra.controller.register('autocomplete', {
	scope: 'comp_autocomplete',
	use: ['suggestions'],
	
	constr: function(me, app, page, orm) {
		
		return {
			events: {

				model: {
					'suggestions': {
						'append': function(col) {
							app.notify('display suggestions', col[0].getAll());
						}
					}
				},
				
				view: {
					
					'do query': function(data) {
						me.methods.startCountDown(function(data){
							orm('suggestions').select({
                                                	        param: data.param,
                                                	        uriParams: {
                                                	                url: data.url
                                                	        },
                                                	        id: data.id
                                                	});
						}, data);
					},
					
					'select suggestion': function(data) {

						var
							packRef = data.ref.split(':')[0],
							objRef = data.ref.split(':')[1]
						;

						orm('suggestions').findByRef(packRef, function(pack){
							page.notify('autocomplete: item selected', {
								obj : pack.get('suggestions').data[objRef],
								origin : data.id
							});
						});

						app.notify('display value', data);
					}
					
				}
			},
			methods : {
				init : function(){
					me.delay = 150; // default delay before sending server-side request
					me.countDown = null;
				},
				startCountDown : function(callback, data){
					// cancel previous counter if it exists
					if(me.countDown) { window.clearTimeout(me.countDown) }
					// set a new counter
					me.countDown = window.setTimeout(callback, me.delay, data);
				}
			}
			
		};
	}
});
