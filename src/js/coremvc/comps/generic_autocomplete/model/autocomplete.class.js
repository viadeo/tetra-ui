tetra.model.register('autocomplete', {
    scope:'comp_autocompleteGeneric',

    req:{
        fetch:{
            url:'{0}',
            uriParams:['url'],
            parser:function (resp, col, cond) {
                resp.id = cond.id;
                col[cond.uriParams.url] = {
                    id:cond.id,
                    completion:resp
                };
                return col;
            }
        }
    },

    attr:{
        completion:{}
    },

    methods:function (attr) {
        return {
            validate:function (attr, errors) {
                return errors;
            }
        };
    }

});