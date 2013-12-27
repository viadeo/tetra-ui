/*! tetra-ui v1.4.7 - 2013 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("dropdown", {
    scope: "dropdown",
    constr: function(me, app, page) {
        "use strict";
        return {
            events: {
                model: {},
                view: {
                    "share btn through apps": function(param) {
                        page.notify("retrieve btn from dropdown comp", param);
                    }
                },
                controller: {
                    "dropdown: close all": function() {
                        app.notify("close all");
                    }
                }
            },
            methods: {
                init: function() {}
            }
        };
    }
}), tetra.view.register("view", {
    use: [ "dropdown" ],
    scope: "dropdown",
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    click: {
                        ".dd": function(e, elm) {
                            var btn = elm.find(".dd-btn:first");
                            me.methods.initDd(e, btn, elm);
                        }
                    },
                    mouseover: {
                        ".dd": function(e, elm) {
                            var btn = elm.find(".dd-btn:first");
                            me.methods.initDd(e, btn, elm);
                        }
                    },
                    clickout: {
                        ".dd": function(e, elm) {
                            var btn = elm.find(".dd-btn:first");
                            "click" === btn.attr("data-event") && me.methods.closeDd(btn, elm);
                        }
                    },
                    mouseout: {
                        ".dd": function(e, elm) {
                            var btn = elm.find(".dd-btn:first");
                            "mouseover" === btn.attr("data-event") && me.methods.closeDd(btn, elm);
                        }
                    }
                },
                controller: {
                    "close all": function() {
                        _(".dd-btn").removeClass("active"), _(".dd").removeClass("open");
                    }
                }
            },
            methods: {
                init: function() {},
                initDd: function(e, btn, dd) {
                    var isEvent = btn.attr("data-event") === e.type, isItem = _(e.target).hasClass("dd-item") || _(e.target).parent().hasClass("dd-item");
                    if (isEvent && dd && !isItem) {
                        var isOpen = dd.hasClass("open"), isDisabled = btn.hasClass("btn-disabled"), isloading = btn.hasClass("btn-loading"), target = _(e.target);
                        return isDisabled || isloading || (isOpen ? (target.hasClass("dd-btn") || target.parents(".dd-btn").length > 0) && "click" === e.type && me.methods.closeDd(btn, dd) : me.methods.openDd(btn, dd)), 
                        "undefined" == typeof btn.attr("data-custom-param") || isOpen || app.notify("share btn through apps", btn), 
                        !1;
                    }
                },
                openDd: function(btn, dd) {
                    btn.addClass("active"), dd.addClass("open");
                },
                closeDd: function(btn, dd) {
                    btn.removeClass("active"), dd.removeClass("open");
                }
            }
        };
    }
});