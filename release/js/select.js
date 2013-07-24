/*! Tetra UI v1.0.33 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.view.register('select', {
  scope: 'select',

  constr: function(me, app, _) {
    'use strict';

    return {
      events: {
        user: {
          'change': {
            '.custom-select select': function(e, elm) {
              var container = _(elm).parents('.custom-select:first');
              container.find('label').html(_(elm).val());
            }
          }
        },

        controller: {}
      },

      methods: {
        init: function() {}
      }
    };
  }
});
