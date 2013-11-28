/*! tetra-ui v1.4.4 - 2013 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("autocomplete", {
    scope: "generic_autocomplete",
    use: [ "autocomplete" ],
    constr: function(me, app, page, orm) {
        "use strict";
        return {
            events: {
                model: {
                    autocomplete: {
                        append: function(col) {
                            app.notify("display suggestions", col[0].get("completion"));
                        }
                    }
                },
                view: {
                    "do query": function(data) {
                        data.uriParams = {
                            url: data.url
                        }, me.methods.startCountDown(function() {
                            orm("autocomplete").fetch(data);
                        }, data);
                    },
                    "autocompleteGeneric : click on suggestion": function(elm) {
                        page.notify("autocompleteGeneric : click on suggestion", elm);
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
                    me.countDown = window.setTimeout(callback, typingDelay, data);
                }
            }
        };
    }
}), tetra.model.register("autocomplete", {
    scope: "generic_autocomplete",
    req: {
        fetch: {
            url: "{0}",
            uriParams: [ "url" ],
            parser: function(resp, col, cond) {
                return resp.id = cond.id, col[cond.uriParams.url] = {
                    id: cond.id,
                    completion: resp
                }, col;
            }
        }
    },
    attr: {
        completion: {}
    },
    methods: function() {
        return {
            validate: function(attr, errors) {
                return errors;
            }
        };
    }
}), tetra.view.register("autocomplete", {
    scope: "generic_autocomplete",
    use: [ "autocomplete" ],
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    keydown: {
                        ".autocomplete input": function(e, elm) {
                            switch (me.methods.reinit(elm), e.which) {
                              case 13:
                                elm = me._container.find(".autocomplete-menu li.active");
                                var prevContainerId = me._containerId;
                                elm.length && (e.preventDefault(), me.methods.suggestions.clickOnSuggestion(elm)), 
                                me.methods.suggestions.hide(prevContainerId);
                                break;

                              case 38:
                              case 40:
                                e.preventDefault();
                            }
                        }
                    },
                    keyup: {
                        ".autocomplete input": function(e, elm) {
                            switch (me.methods.reinit(elm), e.which) {
                              case 37:
                              case 39:
                                me._container.hasClass("active") || me.methods.suggestions.doQuery(elm, !1);
                                break;

                              case 13:
                                break;

                              case 27:
                                me.methods.suggestions.hide(me._containerId);
                                break;

                              case 38:
                                me.methods.suggestions.select("previous");
                                break;

                              case 40:
                                me.methods.suggestions.select("next");
                                break;

                              default:
                                elm.val().length >= parseInt(me._container.attr("data-min-length"), 10) && (me._sts = me._sts > 0 ? me._sts : new Date().getTime(), 
                                me.methods.suggestions.doQuery(elm, !0)), 0 === elm.val().length && (me._sts = 0, 
                                me.methods.suggestions.hide(me._containerId));
                            }
                        }
                    },
                    focus: {
                        ".autocomplete input": function(e, elm) {
                            me._containerId = null, me.methods.reinit(elm), elm.val().length >= parseInt(me._container.attr("data-min-length"), 10) && me.methods.suggestions.doQuery(elm, !0);
                        }
                    },
                    blur: {
                        ".autocomplete input": function(e, elm) {
                            var prevContainerId = me._containerId;
                            me.methods.reinit(elm), window.setTimeout(function() {
                                me.methods.suggestions.hide(prevContainerId);
                            }, 200);
                        }
                    },
                    mouseover: {
                        ".autocomplete .autocomplete-menu li": function(e, elm) {
                            elm.addClass("active").siblings().removeClass("active");
                        }
                    },
                    click: {
                        ".autocomplete .autocomplete-menu li": function(e, elm) {
                            var prevContainerId = me._containerId;
                            me.methods.suggestions.clickOnSuggestion(elm), me.methods.suggestions.hide(prevContainerId);
                        }
                    }
                },
                controller: {
                    "display suggestions": function(suggestionsPack) {
                        var havingSuggestion = !1;
                        for (var suggestion in suggestionsPack.data.completion) {
                            havingSuggestion = !0;
                            break;
                        }
                        if (!havingSuggestion) return me._container.removeClass("active"), _(me._menu).empty(), 
                        void 0;
                        var suggestions = {};
                        suggestions.data = suggestionsPack.data.completion, suggestions.query = me._input.val(), 
                        me._boldifyTerms && (suggestions = me.methods.suggestions.boldify(suggestions)), 
                        app.exec(me._templateRef, suggestions, function(html) {
                            _(me._menu).html(html);
                        }), me._container.attr("data-no-default") || me._menu.find("li:first-child").addClass("active"), 
                        me._container.addClass("active");
                    },
                    "display value": function(data) {
                        me._input.val(data.value), me.methods.suggestions.hide(me._containerId);
                    }
                }
            },
            methods: {
                init: function() {
                    me._param = "%param%", me._containerId = null, me._sts = 0;
                },
                reinit: function(elm) {
                    me._containerId || (me._containerId = _(elm.parents(".autocomplete"))[0].id, me._container = _("#" + me._containerId), 
                    me._paramName = me._container.attr("data-param") || "param", me._input = me._container.find("input"), 
                    me._menu = me._container.find("#" + me._container.attr("data-suggest-container-id")), 
                    me._templateRef = me._container.attr("data-suggest-template-ref"), me._boldifyTerms = me._container.attr("data-boldify") ? me._container.attr("data-boldify").split(",") : 0, 
                    0 === _("#tmpl_" + me._templateRef).length && (me._templateRef = me._templateRef.substring(0, me._templateRef.indexOf("_")) + "_1"));
                },
                suggestions: {
                    select: function(direction) {
                        var selected, items = me._container.find(".autocomplete-menu li"), index = items.filter(".active").removeClass("active").index();
                        index += "next" === direction ? 1 : -1, index >= items.length && (index = 0), selected = items.eq(index), 
                        selected.addClass("active"), selected.hasClass("no-highlight") && me.methods.suggestions.select(direction);
                    },
                    boldify: function(suggestions) {
                        var item, term, i, j, boldTermsLen = me._boldifyTerms.length, re = new RegExp("(" + suggestions.query + ")", "gi");
                        for (i in suggestions.data) for (item = suggestions.data[i], j = 0; boldTermsLen > j; j++) term = me._boldifyTerms[j], 
                        suggestions.data[i][term] = item[term].replace(re, "<b>$1</b>");
                        return suggestions;
                    },
                    hide: function(containerId) {
                        _("#" + containerId).removeClass("active");
                    },
                    replaceParam: function(url, param) {
                        return url.replace(me._param, param);
                    },
                    clickOnSuggestion: function(elm) {
                        var value = _.trim(_(elm.find(".value")).text());
                        "undefined" != typeof value && value.length > 0 && me._input.val(value), app.notify("autocompleteGeneric : click on suggestion", elm[0]), 
                        me._containerId = null;
                    },
                    doQuery: function(elm, delay) {
                        var param = elm.val(), url = me.methods.suggestions.replaceParam(me._container.attr("data-url"), param), data = {
                            url: url,
                            id: me._containerId
                        };
                        delay && (data.typingDelay = me._container.attr("data-typing-delay") || void 0), 
                        data[me._paramName] = param, "quicksearch-input" === elm.prop("id") && (elm.attr("data-sts", me._sts), 
                        data.sts = me._sts);
                        var form;
                        if (elm.hasClass("schoolDepartment")) {
                            if (form = _(elm.parents(".core-form"))[0], _(form).find("#schoolId").val(""), data.itemName = _(form).find(".autocompleteSchool").val(), 
                            data.itemName.blank()) return;
                            data.town = _(form).find("input.town").val();
                        } else elm.hasClass("autocompleteSchool") && (form = _(elm.parents(".core-form"))[0], 
                        _(form).find("#schoolId").val(""), _(form).find("input.town").val(""));
                        app.notify("do query", data);
                    }
                }
            }
        };
    }
});