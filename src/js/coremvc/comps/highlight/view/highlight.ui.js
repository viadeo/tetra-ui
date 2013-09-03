tetra.view.register('highlight', {
	scope: 'highlight',
	use: ['highlight'],

	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'click': {
						'[data-highlight]': function(e, elm) {
							if(elm.attr('data-highlight')) {
								me.esc = elm.attr('data-esc') === "false" ? false : true;
								app.notify('highlight: display', elm.attr('data-highlight'));
							}
						}
					}
				},
				window: {
					'keyup': function(e) {
						if(me.esc && e.keyCode === 27) {
							app.notify('highlight: close');
						}
					}
				},
				controller: { 
					'display highlight' : function(data) {
						if (typeof data === "object" && Object.prototype.toString.call(data) !== "[object Array]") {
							_(data.target).addClass('highlight-target');
							me.esc = data.esc;
						} else {
							_(data).addClass('highlight-target');
						}
						me.methods.createOverlay();
					},
					'close highlight' : function() {
						me.methods.clear();
					}
				}
			},

			methods: {
				init: function() {
					me.esc = true
				},
				clear: function() {
					_('.highlight-target').removeClass('highlight-target');
					_('.highlight-overlay').remove();
				},
				createOverlay: function() {
					if(!_('.highlight-overlay').length) {
						_('body').append('<div class="highlight-overlay"></div>');
					}
				}
			}
		};
	}
});