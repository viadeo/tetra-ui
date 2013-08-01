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
