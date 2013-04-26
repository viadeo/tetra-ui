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