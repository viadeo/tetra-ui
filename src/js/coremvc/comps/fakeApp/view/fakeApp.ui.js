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

                        },
                        '[data-fake-app=growl]':function (e, elm) {

                            var
                                message= _(elm).attr('data-message'),
                                options= {},
                                type= _(elm).attr('data-type'),
                                dismiss= _(elm).attr('data-dismiss'),
                                position= _(elm).attr('data-position'),
                                delay= _(elm).attr('data-delay')
                            ;

                            if(type) options.type = type;
                            if(dismiss) options.dismiss = dismiss;
                            if(position) options.position = position;
                            if(delay) options.delay = Number(delay);

                            app.notify('display growl', {
                                message: message,
                                options : options
                            });

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
