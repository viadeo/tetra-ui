/*! tetra-ui v1.4.3 - 2013 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("growl", {
    scope: "growl",
    constr: function(me, app) {
        return {
            events: {
                controller: {
                    "growl: display": function(params) {
                        me.ready ? (me.count || app.notify("add growl container"), app.notify("display growl", {
                            message: params.message,
                            options: me.methods.extend(me.options, params.options)
                        }), me.count++) : me.growlStack.push({
                            message: params.message,
                            options: me.methods.extend(me.options, params.options)
                        });
                    },
                    "growl: close": function() {
                        app.notify("hide growl");
                    }
                },
                view: {
                    "display stacked messages": function() {
                        me.ready = !0, me.count || app.notify("add growl container");
                        for (var i = 0, l = me.growlStack.length; l > i; i++) app.notify("display growl", {
                            message: me.growlStack[i].message,
                            options: me.growlStack[i].options
                        }), me.count++;
                    }
                }
            },
            methods: {
                init: function() {
                    me.count = 0, me.ready = !1, me.options = {
                        type: "info",
                        width: 350,
                        position: "center",
                        delay: 2500,
                        dismiss: !1,
                        template: "growl"
                    }, me.growlStack = [];
                },
                extend: function(base, source) {
                    var extended = {};
                    for (var baseProperty in base) extended[baseProperty] = base[baseProperty];
                    for (var sourceProperty in source) extended[sourceProperty] = source[sourceProperty];
                    return extended;
                }
            }
        };
    }
}), tetra.view.register("growl", {
    scope: "growl",
    use: [ "growl" ],
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    click: {
                        ".growl-close": function(e, elm) {
                            me.methods.removeGrowl(_(elm).parent(".growl:first"));
                        }
                    }
                },
                controller: {
                    "add growl container": function() {
                        me.growl = _(document.createElement("div")).attr("id", "growl-container").appendTo("body");
                    },
                    "display growl": function(params) {
                        app.exec(params.options.template, params, function(html) {
                            var growl = _(document.createElement("div")).html(html).contents().appendTo(me.growl);
                            params.options.width && me.win.width() >= 350 && growl.width(params.options.width), 
                            params.options.delay && setTimeout(function() {
                                me.methods.removeGrowl(growl);
                            }, params.options.delay), growl.addClass("growl-active");
                        });
                    },
                    "hide growl": function() {
                        me.growl && me.growl.find(".growl").each(function(i, elm) {
                            me.methods.removeGrowl(_(elm));
                        });
                    }
                },
                window: {
                    load: function() {
                        app.notify("display stacked messages");
                    }
                }
            },
            methods: {
                init: function() {
                    me.win = _(window), me.growl = null, me.idle = 500;
                },
                removeGrowl: function(growl) {
                    _(growl).removeClass("growl-active"), setTimeout(function() {
                        _(growl).remove();
                    }, me.idle);
                }
            }
        };
    }
});