tetra.controller.register('autocomplete', {
    scope:'autocomplete',
    use:['autocomplete'], // required models

    constr:function (me, app, page, orm) {

        'use strict';

        return {
            events:{
                model:{ // events received from model
                    'autocomplete':{ // model name

                        'fetch':function (cond) {

                        },

                        'append':function (col) {
                            app.notify('autocomplete: display completion', col[0].get('completion'));
                        }

                    }
                },

                view:{ // events received from view or third party controllers

                    'autocomplete: show':function (data) {

                        orm('autocomplete').fetch({
                            param:data.param,
                            uriParams:{
                                url:data.url
                            },
                            id:data.id
                        });

                    },

                    'autocomplete: set value':function (data) {

                        app.notify('autocomplete: display value', data);

                    }

                }
            },

            methods:{
                init:function () {
                }
            }
        };
    }
});
