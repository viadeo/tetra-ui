/*! tetra-ui v1.4.8 - 2014 | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */

tetra.controller.register("file_upload", {
    scope: "file_upload",
    use: [ "file_upload" ],
    constr: function(me, app, page, orm) {
        "use strict";
        return {
            events: {
                model: {
                    file_upload: {}
                },
                view: {
                    perfomUpload: function(data) {
                        orm("file_upload").create({
                            data: data.data
                        }).save({
                            uriParams: {
                                url: data.url
                            }
                        });
                    },
                    broadcastResponse: function(data) {
                        page.notify("file_upload: response", data);
                    },
                    broadcastSubmit: function(data) {
                        page.notify("file_upload: submitted", data);
                    }
                },
                controller: {
                    "file_upload: submit": function(selector) {
                        app.notify("file_upload: submit", selector);
                    }
                }
            },
            methods: {
                init: function() {}
            }
        };
    }
}), tetra.model.register("file_upload", {
    scope: "file_upload",
    req: {
        save: {
            url: "{0}",
            uriParams: [ "url" ],
            method: "POST",
            processData: !1,
            contentType: !1
        }
    },
    attr: {
        data: ""
    },
    methods: function() {
        return {
            validate: function(attr, errors) {
                return errors;
            }
        };
    }
}), tetra.view.register("file_upload", {
    scope: "file_upload",
    use: [ "file_upload" ],
    constr: function(me, app, _) {
        "use strict";
        return {
            events: {
                user: {
                    submit: {
                        ".form-async-upload": function(e, elm) {
                            e.preventDefault(), me.methods.submitAsyncForm(elm);
                        }
                    }
                },
                controller: {
                    "file_upload: submit": function(selector) {
                        me.methods.submitAsyncForm(selector);
                    }
                }
            },
            methods: {
                init: function() {},
                supportNativeUpload: function() {
                    return !1;
                },
                submitAsyncForm: function(elm) {
                    var form = _(elm);
                    if (app.notify("broadcastSubmit", {
                        id: form.attr("id")
                    }), me.methods.supportNativeUpload()) {
                        var data = new FormData(form);
                        form.find("input, textarea, select").each(function(i, elm) {
                            var element = _(elm);
                            "file" === element.attr("type") ? element[0].files.length > 0 && data.append(element.attr("name"), element[0].files[0]) : data.append(element.attr("name"), element.val());
                        }), app.notify("perfomUpload", {
                            data: data,
                            url: form.attr("action")
                        });
                    } else {
                        var iframe;
                        try {
                            iframe = document.createElement('<iframe name="' + form.attr("id") + '_Frame">');
                        } catch (ex) {
                            iframe = document.createElement("iframe");
                        }
                        iframe.id = form.attr("id") + "_Frame", iframe.name = form.attr("id") + "_Frame", 
                        _(iframe).css("display", "none"), form.attr("target", form.attr("id") + "_Frame").append(iframe).removeClass("form-async-upload").submit(), 
                        iframe.attachEvent ? iframe.attachEvent("onload", function() {
                            me.methods.handleIframeResponse(iframe, form);
                        }) : iframe.addEventListener("load", function() {
                            me.methods.handleIframeResponse(iframe, form);
                        }, !0);
                    }
                },
                handleIframeResponse: function(iframe, form) {
                    try {
                        var response = JSON.parse(iframe.contentWindow.document.body.innerHTML);
                        app.notify("broadcastResponse", {
                            id: form.attr("id"),
                            resp: response,
                            json: !0
                        });
                    } catch (e) {
                        var response = iframe.contentWindow.document.body.innerHTML;
                        app.notify("broadcastResponse", {
                            id: form.attr("id"),
                            resp: response,
                            json: !1
                        });
                    }
                    form.addClass("form-async-upload"), iframe.parentNode.removeChild(iframe);
                }
            }
        };
    }
});