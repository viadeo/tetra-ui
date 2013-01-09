tetra.view.register('fakeApp', {
    scope:'fakeApp', // application name
    use:['fakeApp'], // list of required controllers

    constr:function (me, app, _) {

        'use strict';

        return {
            events:{
                user:{
                    'click':{
                        '[data-fake-app=fake]':function (e, elm) {

                            var data = {
                                url:_(elm).attr('data-target')
                            };
                            app.notify('get data', data);

                        }
                    }
                },

                controller:{
                }
            },

            methods:{
                init:function () {
                }
            }
        };
    }
});
