/*! tetra-ui v1.4.2 - 2013 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("autocomplete", {
    scope: "autocomplete",
    use: [ "suggestions" ],
    constr: function(me, app, page, orm) {
        "use strict";
        return {
            events: {
                model: {
                    suggestions: {
                        append: function(col) {
                            app.notify("display suggestions", col[0].getAll());
                        }
                    }
                },
                view: {
                    "do query": function(data) {
                        me.methods.startCountDown(function(data) {
                            orm("suggestions").select({
                                param: data.param,
                                uriParams: {
                                    url: data.url
                                },
                                id: data.id
                            });
                        }, data);
                    },
                    "select suggestion": function(data) {
                        var packRef = data.ref.split(":")[0], objRef = data.ref.split(":")[1];
                        orm("suggestions").findByRef(packRef, function(pack) {
                            page.notify("autocomplete: item selected", {
                                obj: pack.get("suggestions").data[objRef],
                                origin: data.id
                            });
                        }), app.notify("display value", data);
                    }
                }
            },
            methods: {
                init: function() {
                    me.defaultTypingDelay = 150, me.countDown = null;
                },
                startCountDown: function(callback, data) {
                    me.countDown && window.clearTimeout(me.countDown);
                    var typingDelay = "undefined" != typeof data.typingDelay ? data.typingDelay : me.defaultTypingDelay;
                    me.countDown = window.setTimeout(function() {
                        callback(data);
                    }, typingDelay);
                }
            }
        };
    }
}), tetra.model.register("suggestions", {
    scope: "autocomplete",
    req: {
        fetch: {
            url: "{0}",
            uriParams: [ "url" ],
            parser: function(resp, col, cond) {
                return resp.id = cond.id, col[cond.uriParams.url] = {
                    id: cond.id,
                    suggestions: resp
                }, col;
            }
        }
    },
    attr: {
        suggestions: {}
    },
    methods: function() {
        return {
            validate: function(attr, errors) {
                return errors;
            }
        };
    }
}), tetra.view.register("autocomplete", {
    scope: "autocomplete",
    use: [ "autocomplete" ],
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    keydown: {
                        ".autocomplete input": function(e, elm) {
                            var container = elm.parents(".autocomplete");
                            switch (e.which) {
                              case 13:
                                e.preventDefault();
                                var active = container.find(".autocomplete-menu li.active");
                                app.notify("select suggestion", {
                                    value: active.attr("data-value"),
                                    id: container.attr("id"),
                                    ref: active.attr("data-ref")
                                });
                                break;

                              case 38:
                              case 40:
                                e.preventDefault();
                            }
                        }
                    },
                    keyup: {
                        ".autocomplete input": function(e, elm) {
                            var container = elm.parents(".autocomplete");
                            switch (e.which) {
                              case 37:
                              case 39:
                                container.hasClass("active") || app.notify("do query", {
                                    url: container.attr("data-url"),
                                    param: elm.val(),
                                    id: container.attr("id")
                                });
                                break;

                              case 13:
                                break;

                              case 27:
                                me.methods.suggestions.hide(container.attr("id"));
                                break;

                              case 38:
                                me.methods.suggestions.select(container.attr("id"), "previous");
                                break;

                              case 40:
                                me.methods.suggestions.select(container.attr("id"), "next");
                                break;

                              default:
                                elm.val().length >= parseInt(container.attr("data-min-length"), 10) && app.notify("do query", {
                                    url: container.attr("data-url"),
                                    param: elm.val(),
                                    id: container.attr("id"),
                                    typingDelay: container.attr("data-typing-delay") || void 0
                                });
                            }
                        }
                    },
                    blur: {
                        ".autocomplete input": function(e, elm) {
                            var container = elm.parents(".autocomplete");
                            window.setTimeout(function() {
                                me.methods.suggestions.hide(container.attr("id"));
                            }, 200);
                        }
                    },
                    click: {
                        ".autocomplete .autocomplete-menu li": function(e, elm) {
                            var container = elm.parents(".autocomplete");
                            app.notify("select suggestion", {
                                value: elm.attr("data-value"),
                                id: container.attr("id"),
                                ref: elm.attr("data-ref")
                            });
                        }
                    }
                },
                controller: {
                    "display suggestions": function(suggestionsPack) {
                        var container = _("#" + suggestionsPack.suggestions.id), menu = container.find(".autocomplete-menu");
                        _.each(suggestionsPack.suggestions.data, function(key, value) {
                            value.ref = suggestionsPack.ref + ":" + key;
                        }), app.exec(container.attr("data-template-id"), suggestionsPack.suggestions, function(html) {
                            _(menu).html(html);
                        }), container.attr("data-no-default") || menu.find("li:first-child").addClass("active"), 
                        container.addClass("active");
                    },
                    "display value": function(data) {
                        var container = _("#" + data.id);
                        container.find("input").val(data.value), me.methods.suggestions.hide(data.id);
                    }
                }
            },
            methods: {
                suggestions: {
                    select: function(containerId, direction) {
                        var items = _("#" + containerId).find(".autocomplete-menu li"), index = items.filter(".active").removeClass("active").index();
                        index += "next" === direction ? 1 : -1, index >= items.length ? index = 0 : -1 > index && (index = items.length - 1), 
                        items.eq(index).addClass("active");
                    },
                    hide: function(containerId) {
                        _("#" + containerId).removeClass("active");
                    }
                }
            }
        };
    }
});