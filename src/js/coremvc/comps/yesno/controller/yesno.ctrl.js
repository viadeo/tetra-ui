/* TODO :
 *  must be compatible with and on files under index.xsl (XSL V1) 
 *  must take any param in any model (see magicMode.class.js for example)
 *  change img css background in gradient css (see dashboard.css)
 * 
 * */
tetra.controller.register('yesno', {
	scope: 'yesno',
	use: ['yesno'],
	constr: function(me, app, page, orm) {

		'use strict';

		return {
			events: {
				model: {
					'yesno': {
						'error': function(error) {
							app.notify('switchback yesno after error', error.obj);
						}
					}
				},
				view: {
					"save state": function(data) {
						if(typeof data.oparam !== 'undefined') {
							orm('yesno').create({}).setCustom(data.oparam).save({param: data.param, status: true, uriParams: {url: data.url}});
						} else {
							orm('yesno').create({}).save({param: data.param, status: true, uriParams: {url: data.url}});
						}

					},
					"delete state": function(data) {
						if(typeof data.oparam !== 'undefined') {
							orm('yesno').create({}).setCustom(data.oparam).remove({param: data.param, status: false, uriParams: {url: data.url}});
						} else {
							orm('yesno').create({}).remove({param: data.param, status: false, uriParams: {url: data.url}});
						}
					}
				}
			},
			methods: {
				init: function() {
				}
			}
		};
	}
});