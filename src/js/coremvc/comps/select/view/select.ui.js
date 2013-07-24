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
