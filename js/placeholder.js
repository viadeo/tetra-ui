/*! tetra-ui v1.4.0 - 2013 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.view.register("placeholder", {
    scope: "placeholder",
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    click: {
                        ".placeholding": function(e, elm) {
                            _(elm).addClass("active");
                        }
                    },
                    clickout: {
                        ".placeholding": function(e, elm) {
                            _(elm).removeClass("active");
                        }
                    },
                    focus: {
                        ".placeholding input, .placeholding textarea": function(e, elm) {
                            _(elm).parent().addClass("active");
                        }
                    },
                    blur: {
                        ".placeholding input, .placeholding textarea": function(e, elm) {
                            _(elm).parent().removeClass("active");
                        }
                    },
                    input: {
                        ".placeholding input": function(e, elm) {
                            me.methods.isTyping(elm);
                        }
                    },
                    keyup: {
                        ".placeholding input, .placeholding textarea": function(e, elm) {
                            me.methods.isTyping(elm);
                        }
                    }
                },
                controller: {}
            },
            methods: {
                init: function() {
                    _(document).ready(function() {
                        for (var fields = _(".placeholding input, .placeholding textarea"), i = 0; i < fields.length; i++) {
                            var input = fields[i];
                            _(input).val().length > 0 && _(input).parent().addClass("typing");
                        }
                    });
                },
                isTyping: function(elm) {
                    var placeholding = _(elm).parent(), typed = _(elm).val().length;
                    typed > 0 ? placeholding.hasClass("typing") || placeholding.addClass("typing") : placeholding.removeClass("typing");
                }
            }
        };
    }
});