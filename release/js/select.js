/*! Tetra UI v1.2.0 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

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
              var selectedText = container.find('option:selected').html();
              container.find('label').html(selectedText);
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
