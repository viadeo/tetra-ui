tetra.controller.register('file_upload', {
	scope: 'file_upload',
	use: ['file_upload'],

	constr: function(me, app, page, orm) {

		'use strict';

		return {
			events: {
				model: {
					'file_upload': { }
				},

				view: {	
					'perfomUpload' : function(data) {
						orm('file_upload').create({'data' : data.data}).save({uriParams: { url: data.url }});
					},
					'broadcastResponse' : function(data) {
						page.notify('file_upload: response', data);
					},
					'broadcastSubmit' : function(data) {
						page.notify('file_upload: submitted', data);
					}
				}
			},

			methods: {
				init: function() { }
			}
		};
	}
});