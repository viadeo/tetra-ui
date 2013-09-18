/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.model.register('file_upload', {
	scope: 'file_upload',

	req: {
		save : {
			url : '{0}',
			uriParams: ['url'],
			method : 'POST',
			processData: false,
			contentType : false
		}
	},

	attr: {
		data: ''
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			}
		};
	}

});
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
tetra.view.register('file_upload', {
	scope: 'file_upload',
	use: ['file_upload'],

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'submit': {
						'.form-async-upload' : function(e, elm) {
							e.preventDefault();
							me.methods.submitAsyncForm(elm);
						}
					}
				},
				controller: { 
					'file_upload: submit' : function(selector) {
						me.methods.submitAsyncForm(_(selector));
					}
				}
			},

			methods: {
				'init': function() { },
				'supportNativeUpload': function() {
					return false;
					//return !! window.FormData;
				},
				'submitAsyncForm' : function(elm) {
					var form = _(elm);
					app.notify('broadcastSubmit', {id : form.attr('id')});

					if(me.methods.supportNativeUpload()) {
						var data = new FormData(form);

						form.find('input, textarea, select').each(function(i, elm) {
							var element = _(elm);
							if(element.attr('type')==='file') {
								if(element[0].files.length > 0) {
									data.append(element.attr('name'), element[0].files[0]);
								}
							} else {
								data.append(element.attr('name'), element.val());
							}
						});

						app.notify('perfomUpload', {data : data, url : form.attr('action')});
					} else {
						var iframe = document.createElement("iframe");
						_(iframe).attr('name', form.attr('id') + "_Frame").css('display', 'none');

						form.attr('target', form.attr('id') + "_Frame")
							.append(iframe)
							.removeClass('form-async-upload')
							.submit();

						if(iframe.attachEvent) {
							iframe.attachEvent('onload', function() {
								me.methods.handleIframeResponse(iframe, form);
							});
						} else {
							iframe.addEventListener('load', function() {
								me.methods.handleIframeResponse(iframe, form);
							}, true);
						}
					}
				},
				'handleIframeResponse' : function(iframe, form) {
					try {
						var response = JSON.parse(iframe.contentWindow.document.body.innerHTML);
						app.notify('broadcastResponse', {id : form.attr('id'), resp : response, json : true});
					} catch(e) {
						var response = iframe.contentWindow.document.body.innerHTML;
						app.notify('broadcastResponse', {id : form.attr('id'), resp : response, json : false});
					}
					form.addClass('form-async-upload');
					iframe.remove();
				}
			}
		};
	}
});