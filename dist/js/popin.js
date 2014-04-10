/*! tetra-ui v1.4.8 - 2014 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("popin", {
    scope: "popin",
    use: [ "popin" ],
    constr: function(me, app, page, orm) {
        "use strict";
        return {
            events: {
                model: {
                    popin: {
                        fetch: function() {
                            app.notify("start loading");
                        },
                        append: function(col) {
                            var data = {
                                html: col[0].get("html"),
                                url: col[0].get("id"),
                                _timestamp: col[0].get("timestamp")
                            };
                            app.notify("end loading").notify("set content", {
                                content: data.html
                            }), page.notify("popin: success", data);
                        },
                        error: function(error) {
                            app.notify("end loading").notify("show error", error);
                        }
                    }
                },
                view: {
                    "show error": function() {
                        page.notify("growl: display", {
                            message: lang["notification.modification.save.error"],
                            options: {
                                type: "warning"
                            }
                        });
                    },
                    "popin: set content": function(data) {
                        me.methods.setContent(data);
                    },
                    "popin: close": function() {
                        app.notify("clear", {
                            url: me.url,
                            id: me.id
                        });
                    },
                    "popin: closed": function(data) {
                        page.notify("popin: closed", data);
                    }
                },
                controller: {
                    "popin: loading": function() {
                        app.notify("start loading");
                    },
                    "popin: set content": function(data) {
                        me.methods.setContent(data);
                    },
                    "popin: close": function() {
                        app.notify("clear", {
                            url: me.url,
                            id: me.id
                        });
                    },
                    "popin: fadeout": function() {
                        app.notify("fadeout", {
                            url: me.url,
                            id: me.id
                        }), window.setTimeout(function() {
                            app.notify("clear", {
                                url: me.url,
                                id: me.id
                            });
                        }, 300);
                    },
                    "popin: show loader": function() {
                        app.notify("show loader");
                    },
                    "popin: hide loader": function() {
                        app.notify("hide loader");
                    }
                }
            },
            methods: {
                init: function() {
                    me.id = null, me.url = null;
                },
                setContent: function(data) {
                    data._timestamp = new Date().getTime(), data.url ? (me.url = data.url, me.id = null, 
                    orm("popin").fetch({
                        uriParams: {
                            url: data.url
                        },
                        timestamp: data._timestamp
                    })) : data.id ? (me.id = data.id, me.url = null, app.notify("start loading").notify("load from dom", data.id), 
                    page.notify("popin: success", data)) : data.html && (me.id = null, me.url = null, 
                    app.notify("start loading").notify("set content", {
                        content: data.html
                    }), page.notify("popin: success", data));
                }
            }
        };
    }
}), tetra.model.register("popin", {
    scope: "popin",
    req: {
        fetch: {
            url: "{0}",
            uriParams: [ "url" ],
            parser: function(resp, col, cond) {
                return col[cond.uriParams.url] = {
                    id: cond.uriParams.url,
                    html: resp.toString(),
                    timestamp: cond.timestamp
                }, col;
            }
        }
    },
    attr: {
        html: "",
        url: "",
        timestamp: ""
    },
    methods: function(attr) {
        return {
            validate: function(attr, errors) {
                return errors;
            },
            getAttr: function() {
                return attr;
            }
        };
    }
}), tetra.view.register("popin", {
    scope: "popin",
    use: [ "popin" ],
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    click: {
                        "[data-popin]": function(e, elm) {
                            "show" === elm.attr("data-popin") ? elm.attr("data-target-url") ? app.notify("popin: set content", {
                                url: elm.attr("data-target-url")
                            }) : elm.attr("data-target-id") && app.notify("popin: set content", {
                                id: elm.attr("data-target-id")
                            }) : "close" === elm.attr("data-popin") && app.notify("popin: close");
                        }
                    }
                },
                window: {
                    keyup: function(e) {
                        27 !== e.keyCode || _(".popin-container .popin").attr("data-noesc") || app.notify("popin: close");
                    }
                },
                controller: {
                    "start loading": function() {
                        me.methods.clear(), me.methods.createPopin();
                    },
                    "end loading": function() {},
                    "set content": function(data) {
                        me.methods.createPopin(), _("body .popin-container").html(data.content);
                    },
                    "show error": function(error) {
                        me.methods.clear(), 401 !== error.errorCode && app.notify("show error");
                    },
                    clear: function(data) {
                        if (data.id) {
                            var content = _(".popin-container").html();
                            me.methods.clear(), _("#" + data.id).html(content);
                        } else me.methods.clear();
                        app.notify("popin: closed", data);
                    },
                    fadeout: function() {
                        _(".popin-overlay").remove(), _(".popin-container .popin").addClass("popin-close-animation");
                    },
                    "load from dom": function(id) {
                        var content = _("#" + id).html();
                        _("#" + id).empty(), _(".popin-container").html(content);
                    },
                    "show loader": function() {
                        _(".popin-container .popin-footer").addClass("loading");
                    },
                    "hide loader": function() {
                        _(".popin-container .popin-footer").removeClass("loading");
                    }
                }
            },
            methods: {
                init: function() {},
                clear: function() {
                    _(".popin-container").remove(), _(".popin-overlay").remove();
                },
                createPopin: function() {
                    _(".popin-overlay").length || _("body").append('<div class="popin-overlay"></div><div class="popin-container"><span class="popin-loader"></span></div>');
                }
            }
        };
    }
});