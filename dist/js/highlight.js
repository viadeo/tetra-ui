/*! tetra-ui v1.4.4 - 2013 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("highlight", {
    scope: "highlight",
    use: [],
    constr: function(me, app) {
        "use strict";
        return {
            events: {
                view: {
                    "highlight: display": function(target) {
                        app.notify("display highlight", target);
                    },
                    "highlight: close": function() {
                        app.notify("close highlight");
                    }
                },
                controller: {
                    "highlight: display": function(target) {
                        app.notify("display highlight", target);
                    },
                    "highlight: close": function() {
                        app.notify("close highlight");
                    }
                }
            },
            methods: {
                init: function() {}
            }
        };
    }
}), tetra.view.register("highlight", {
    scope: "highlight",
    use: [ "highlight" ],
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    click: {
                        "[data-highlight]": function(e, elm) {
                            elm.attr("data-highlight") && (me.esc = "false" === elm.attr("data-esc") ? !1 : !0, 
                            app.notify("highlight: display", elm.attr("data-highlight")));
                        }
                    }
                },
                window: {
                    keyup: function(e) {
                        me.esc && 27 === e.keyCode && app.notify("highlight: close");
                    }
                },
                controller: {
                    "display highlight": function(data) {
                        "object" == typeof data && "[object Array]" !== Object.prototype.toString.call(data) ? (_(data.target).addClass("highlight-target"), 
                        me.esc = data.esc) : _(data).addClass("highlight-target"), me.methods.createOverlay();
                    },
                    "close highlight": function() {
                        me.methods.clear();
                    }
                }
            },
            methods: {
                init: function() {
                    me.esc = !0;
                },
                clear: function() {
                    _(".highlight-target").removeClass("highlight-target"), _(".highlight-overlay").remove();
                },
                createOverlay: function() {
                    _(".highlight-overlay").length || _("body div").hasClass("msie7") || _("body").append('<div class="highlight-overlay"></div>');
                }
            }
        };
    }
});