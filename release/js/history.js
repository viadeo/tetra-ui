/*! Tetra UI v1.0.1 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register('history', {
    scope:'comp_history',

    constr:function (me, app, page, orm) {

        'use strict';

        return {
            events:{

                controller:{

                    'history: push state':function (state) {
                        History.pushState(state.data, state.title, state.url);
                    }

                }

            },

            methods:{
                init:function () {

                    History.Adapter.bind(window, 'statechange', function () {
                        var state = History.getState();

                        page.notify('history: state change', {
                            data:state.data,
                            title:state.title,
                            url:state.url
                        });

                    });

                }
            }
        };
    }
});
