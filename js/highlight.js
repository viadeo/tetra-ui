/*! Tetra UI v1.2.9 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register('highlight', {
  scope: 'highlight',
  use: [],

  constr: function(me, app, page, orm) {

    'use strict';

    return {
      events: {
        view: {
          'highlight: display': function(target) {
            app.notify('display highlight', target);
            /* TODO :
               Accept an array of element as argument and provide next/prev method to it to create tutorials easily
            */
          },
          'highlight: close': function() {
            app.notify('close highlight');
          }
        },
        controller: {
          'highlight: display': function(target) {
            app.notify('display highlight', target);
          },
          'highlight: close': function() {
            app.notify('close highlight');
          }
        }
      },

      methods: {
        init: function() { }
      }
    };
  }
});

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