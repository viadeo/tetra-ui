tetra.model.register('fakeApp', {
    scope:'fakeApp',

    req:{
        fetch:{
            url:'{0}',
            uriParams:['url'],
            parser:function (resp, col, cond) {
                col[cond.uriParams.url] = {
                    id:cond.uriParams.url,
                    html:resp.toString()
                };
                return col;
            }
        }
    },

    attr:{
        html:'',
        url:''
    },

    methods:function (attr) {
        return {
            validate:function (attr, errors) {
                return errors;
            },
            getAttr:function () {
                return attr;
            }
        };
    }

});