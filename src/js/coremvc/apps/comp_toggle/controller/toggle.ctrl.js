tetra.controller.register('toggle', {
    scope:'comp_toggle',

    constr:function (me, app, page, orm) {

        'use strict';

        return {
            events:{
                view:{
                    'change toggle state':function (data) {

                        page.notify('toggle: set state', {
                            id:data.id,
                            state:!data.state
                        });

                    }
                },

                controller:{
                    'toggle: set state':function (data) {
                        app.notify('set state', {
                            id:data.id,
                            state:data.state
                        });
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
