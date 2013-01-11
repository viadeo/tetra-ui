tetra.controller.register('fakeApp', {
    scope:'fakeApp', // application name
    use:['fakeApp'], // list of required models

    constr:function (me, app, page, orm) {

        'use strict';

        return {
            events:{
                model:{ // events received from model
                    'fakeApp':{ // model name
                        'call':function () {
                            page.notify('popin: loading');
                        },
                        'append':function (col) {
                            me.timestamp = (new Date()).getTime();
                            page.notify('popin: set content', { html:col[0].get('html') });
                        }
                    }
                },

                view:{ // events received from view
                    'get data':function (data) {

                        orm('fakeApp').fetch({ uriParams:{ url:data.url } });

                    }
                },

                controller:{
                    'popin: success':function (obj) {

                        //console.log(obj._timestamp, me.timestamp);

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
