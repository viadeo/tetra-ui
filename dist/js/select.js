/*! tetra-ui v1.3.2 - 2013-11-12 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.view.register("select", {
    scope: "select",
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    change: {
                        ".custom-select select": function(e, elm) {
                            var container = _(elm).parents(".custom-select:first"), selectedText = container.find("option:selected").html();
                            container.find("label").html(selectedText);
                        }
                    },
                    focus: {
                        ".custom-select": function(e, elm) {
                            _(elm).addClass("cs-focus");
                        }
                    },
                    blur: {
                        ".custom-select": function(e, elm) {
                            _(elm).removeClass("cs-focus");
                        }
                    },
                    keyup: {
                        ".custom-select select": function(e, elm) {
                            (38 === e.keyCode || 40 === e.keyCode) && _(elm).change();
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