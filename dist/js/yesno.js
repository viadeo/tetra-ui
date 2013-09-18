/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.model.register('yesno', {

	scope: "yesno",

	req: {
		save: {
			url: '{0}',
			uriParams: ['url'],
			method: 'POST'
		},
		del: {
			url: '{0}',
			uriParams: ['url'],
			method: 'POST'
		}
	},
	attr: {
		status: true,
		param: ''
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			},
			setCustom: function(obj) {
				attr[obj.name] = obj.value;
				return this;
			}
		};
	}

});
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
tetra.view.register('yesno', {
	use: ['yesno'],
	scope: 'yesno',
	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.btn-yn': function(e, elm) {
							// Switch state if:
							// yes is active and user clicks no
							// or: no is active and user clicks yes
							// otherwise, do nothing
							if(
								(_(elm).hasClass('btn-yes') && (_(e.target).hasClass('lnk-no'))) ||
									(_(elm).hasClass('btn-no') && (_(e.target).hasClass('lnk-yes')))
								) {
								me.methods.switchstate(elm);
							}
						}
					}
				},
				controller: {
					'switchback yesno after error': function(obj) {
						me.methods.switchback(_("[data-param = " + obj.get('param') + "]"), obj.get('status'));
						VNS.ui.growl(lang['notification.modification.save.error']);
					}
				}
			},
			methods: {
				init: function() {

				},
				switchstate: function(elmt) {
					if(elmt.attr('data-param') === 'allowIndexing') {
						if(elmt.hasClass("btn-no")) {
							_('#lightProfileBox').removeClass('hidden');
							_('#blockChangeNickname').removeClass('hidden');
						} else {
							_('#lightProfileBox').addClass('hidden');
							_('#blockChangeNickname').addClass('hidden');
						}
					}
					if(elmt.attr('data-param') === 'lightPublicProfile') {
						var publicProfileUrl = _('#lightPublicProfileTooltip').find('a')[0].href;
						var i = publicProfileUrl.indexOf('&ts=');
						if(i > 0) {
							publicProfileUrl = publicProfileUrl.substring(0, i);
						}
						publicProfileUrl += '&ts=' + new Date().getTime();
						_('#lightPublicProfileTooltip').find('a')[0].href = publicProfileUrl;
						if(elmt.hasClass("btn-no")) {
							_('#lightPublicProfileTooltip').addClass('lightPublicProfileNoMode');
						} else {
							_('#lightPublicProfileTooltip').removeClass('lightPublicProfileNoMode');
						}
					}

					var opParam;
					if(elmt.attr('data-opname') !== '') {
						opParam = {
							name: elmt.attr('data-opname'),
							value: elmt.attr('data-opvalue')
						};
					}

					if(elmt.hasClass("btn-no")) {
						elmt
							.removeClass("btn-no")
							.addClass("btn-yes");
						app.notify('save state', {url: elmt.attr('data-url'), param: elmt.attr('data-param'), oparam: opParam});
					} else {
						elmt
							.addClass("btn-no")
							.removeClass("btn-yes");
						app.notify('delete state', {url: elmt.attr('data-url'), param: elmt.attr('data-param'), oparam: opParam});
					}
				},
				switchback: function(elmt, status) {
					if(status) {
						elmt
							.addClass("btn-no")
							.removeClass("btn-yes");
					} else {
						elmt
							.removeClass("btn-no")
							.addClass("btn-yes");
					}
				}

			}
		};
	}
});