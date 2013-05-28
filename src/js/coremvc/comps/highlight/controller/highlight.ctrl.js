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
