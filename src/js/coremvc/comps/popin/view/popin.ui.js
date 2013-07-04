tetra.view.register('popin', {
	scope: 'popin',
	use: ['popin'],

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'click': {
						'[data-popin]': function(e, elm) {

							if (elm.attr('data-popin') === 'show') {

								if (elm.attr('data-target-url')) {

									app.notify('popin: set content', {
										url: elm.attr('data-target-url')
									});

								} else if (elm.attr('data-target-id')) {

									app.notify('popin: set content', {
										id: elm.attr('data-target-id')
									});

								}

							} else if (elm.attr('data-popin') === 'close') {

								app.notify('popin: close');

							}

						}
					}
				},
				window: {
					'keyup': function(e) {
						if ((e.keyCode === 27) && (! _('.popin-container .popin').attr('data-noesc'))) {
							app.notify('popin: close');
						}
					}
				},
				controller: {
					'start loading': function() {
						me.methods.clear();
						me.methods.createPopin();
					},
					'end loading': function() {
					},
					'set content': function(data) {
						me.methods.createPopin();
						_('body .popin-container').html(data.content);
					},
					'show error': function(error) {
						me.methods.clear();
						if (error.errorCode !== 401) {
							VNS.ui.growl(lang['notification.modification.save.error'], {type: 'warn'});
						}
					},
					'clear': function(data) {
						if (data.id) { // putting back the popin content to where it was in the dom
							var content = _('.popin-container').html();
							me.methods.clear();
							_('#' + data.id).html(content);
						} else {
							me.methods.clear();
						}

						app.notify('popin: closed', data);
					},
					'fadeout': function() {
						_('.popin-overlay').remove();
						_('.popin-container .popin').addClass('popin-close-animation');
					},
					'load from dom': function(id) {
						var content = _('#' + id).html();
						_('#' + id).empty();
						_('.popin-container').html(content);
					},
					'show loader': function() {
						_('.popin-container .popin-footer').addClass('loading');
					},
					'hide loader': function() {
						_('.popin-container .popin-footer').removeClass('loading');
					}
				}
			},

			methods: {
				init: function() {

				},
				clear: function() {
					_('.popin-container').remove();
					_('.popin-overlay').remove();
				},
				createPopin: function() {
					if(!_('.popin-overlay').length) {
						_('body').append('<div class="popin-overlay"></div><div class="popin-container"><span class="popin-loader"></span></div>');
					}
				}
			}
		};
	}
});
