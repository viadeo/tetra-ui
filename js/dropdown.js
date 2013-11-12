/*! tetra-ui v1.3.2 - 2013-11-12 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

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
}), tetra.view.register("click_enabled", {
    scope: "dropdown",
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    click: {
                        ".dd-btn": function(e, elm) {
                            var dd = elm.parents(".dd"), callbackReference = _(elm).attr("class").replace(/^.*\b(clickout-\d+)\b.*$/, "$1");
                            _(elm).attr("data-dropdown-callback", callbackReference), _(dd).addClass(callbackReference), 
                            me.methods.initDd(e, elm, dd);
                        }
                    },
                    mouseover: {
                        ".dd": function(e, elm) {
                            var btn = elm.find(".dd-btn:first");
                            me.methods.initDd(e, btn, elm);
                        }
                    },
                    clickout: {
                        ".dd-btn": function(e, elm) {
                            var dd = elm.parents(".dd");
                            "click" === elm.attr("data-event") && 0 === _(e.target).parents(".dd." + _(elm).attr("data-dropdown-callback")).length && (_(e.target).parents(".dd." + _(elm).attr("data-dropdown-callback")).removeClass(_(elm).attr("data-dropdown-callback")), 
                            _(elm).removeAttr("data-dropdown-callback"), me.methods.closeDd(elm, dd));
                        }
                    },
                    mouseout: {
                        ".dd": function(e, elm) {
                            var btn = elm.find(".dd-btn:first");
                            "mouseover" === btn.attr("data-event") && me.methods.closeDd(btn, elm);
                        }
                    }
                },
                controller: {}
            },
            methods: {
                init: function() {},
                initDd: function(e, btn, dd) {
                    var isEvent = btn.attr("data-event") === e.type;
                    if (isEvent && dd) {
                        var isOpen = dd.hasClass("open"), isDisabled = btn.hasClass("btn-disabled"), isloading = btn.hasClass("btn-loading"), target = _(e.target);
                        return isDisabled || isloading || (isOpen ? (target.hasClass("dd-btn") || target.parents(".dd-btn").length > 0) && "click" === e.type && me.methods.closeDd(btn, dd) : me.methods.openDd(btn, dd)), 
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