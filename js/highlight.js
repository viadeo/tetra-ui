/*! Tetra UI v1.2.3 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

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
								app.notify('highlight: display', elm.attr('data-highlight'));
							}
						}
					}
				},
				window: {
					'keyup': function(e) {
						if(e.keyCode === 27) {
							app.notify('highlight: close');
						}
					}
				},
				controller: { 
					'display highlight' : function(target) {
						_(target).addClass('highlight-target');
						me.methods.createOverlay();
					},
					'close highlight' : function() {
						me.methods.clear();
					}
				}
			},

			methods: {
				init: function() {

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