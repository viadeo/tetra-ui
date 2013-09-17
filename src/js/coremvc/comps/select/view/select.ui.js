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
          },

          'focus': {
            '.custom-select': function(e,elm) {
              _(elm).addClass('cs-focus');
            }
          },

          'blur': {
            '.custom-select': function(e, elm) {
              _(elm).removeClass('cs-focus');
            }
          },

          'keyup':{
            '.custom-select select': function(e, elm) {
              if ((e.keyCode === 38) || (e.keyCode === 40)) {
                _(elm).change();
              }
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
