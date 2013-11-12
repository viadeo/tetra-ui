/*! tetra-ui v1.3.2 - 2013-11-12 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("yesno", {
    scope: "yesno",
    use: [ "yesno" ],
    constr: function(me, app, page, orm) {
        "use strict";
        return {
            events: {
                model: {
                    yesno: {
                        error: function(error) {
                            app.notify("switchback yesno after error", error.obj);
                        }
                    }
                },
                view: {
                    "show error": function() {
                        page.notify("growl: display", {
                            message: lang["notification.modification.save.error"]
                        });
                    },
                    "save state": function(data) {
                        "undefined" != typeof data.oparam ? orm("yesno").create({}).setCustom(data.oparam).save({
                            param: data.param,
                            status: !0,
                            uriParams: {
                                url: data.url
                            }
                        }) : orm("yesno").create({}).save({
                            param: data.param,
                            status: !0,
                            uriParams: {
                                url: data.url
                            }
                        });
                    },
                    "delete state": function(data) {
                        "undefined" != typeof data.oparam ? orm("yesno").create({}).setCustom(data.oparam).remove({
                            param: data.param,
                            status: !1,
                            uriParams: {
                                url: data.url
                            }
                        }) : orm("yesno").create({}).remove({
                            param: data.param,
                            status: !1,
                            uriParams: {
                                url: data.url
                            }
                        });
                    }
                }
            },
            methods: {
                init: function() {}
            }
        };
    }
}), tetra.model.register("yesno", {
    scope: "yesno",
    req: {
        save: {
            url: "{0}",
            uriParams: [ "url" ],
            method: "POST"
        },
        del: {
            url: "{0}",
            uriParams: [ "url" ],
            method: "POST"
        }
    },
    attr: {
        status: !0,
        param: ""
    },
    methods: function(attr) {
        return {
            validate: function(attr, errors) {
                return errors;
            },
            setCustom: function(obj) {
                return attr[obj.name] = obj.value, this;
            }
        };
    }
}), tetra.view.register("yesno", {
    use: [ "yesno" ],
    scope: "yesno",
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    click: {
                        ".btn-yn": function(e, elm) {
                            (_(elm).hasClass("btn-yes") && _(e.target).hasClass("lnk-no") || _(elm).hasClass("btn-no") && _(e.target).hasClass("lnk-yes")) && me.methods.switchstate(elm);
                        }
                    }
                },
                controller: {
                    "switchback yesno after error": function(obj) {
                        me.methods.switchback(_("[data-param = " + obj.get("param") + "]"), obj.get("status")), 
                        app.notify("show error");
                    }
                }
            },
            methods: {
                init: function() {},
                switchstate: function(elmt) {
                    if ("allowIndexing" === elmt.attr("data-param") && (elmt.hasClass("btn-no") ? (_("#lightProfileBox").removeClass("hidden"), 
                    _("#blockChangeNickname").removeClass("hidden")) : (_("#lightProfileBox").addClass("hidden"), 
                    _("#blockChangeNickname").addClass("hidden"))), "lightPublicProfile" === elmt.attr("data-param")) {
                        var publicProfileUrl = _("#lightPublicProfileTooltip").find("a")[0].href, i = publicProfileUrl.indexOf("&ts=");
                        i > 0 && (publicProfileUrl = publicProfileUrl.substring(0, i)), publicProfileUrl += "&ts=" + new Date().getTime(), 
                        _("#lightPublicProfileTooltip").find("a")[0].href = publicProfileUrl, elmt.hasClass("btn-no") ? _("#lightPublicProfileTooltip").addClass("lightPublicProfileNoMode") : _("#lightPublicProfileTooltip").removeClass("lightPublicProfileNoMode");
                    }
                    var opParam;
                    "" !== elmt.attr("data-opname") && (opParam = {
                        name: elmt.attr("data-opname"),
                        value: elmt.attr("data-opvalue")
                    }), elmt.hasClass("btn-no") ? (elmt.removeClass("btn-no").addClass("btn-yes"), app.notify("save state", {
                        url: elmt.attr("data-url"),
                        param: elmt.attr("data-param"),
                        oparam: opParam
                    })) : (elmt.addClass("btn-no").removeClass("btn-yes"), app.notify("delete state", {
                        url: elmt.attr("data-url"),
                        param: elmt.attr("data-param"),
                        oparam: opParam
                    }));
                },
                switchback: function(elmt, status) {
                    status ? elmt.addClass("btn-no").removeClass("btn-yes") : elmt.removeClass("btn-no").addClass("btn-yes");
                }
            }
        };
    }
});