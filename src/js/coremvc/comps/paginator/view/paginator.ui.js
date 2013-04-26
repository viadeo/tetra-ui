tetra.view.register('paginator', {
	scope: 'paginator',
	constr: function(me, app, _) {

		'use strict';

		return {
			events: {
				user: {
					'click': {
						'.paginator .paginator-btn': function(e, elm) {
							var
								parent = elm.parents(".multi:first"),
								list = parent.find(".multi-list:first")
								;
							parent.addClass("open");
							me.methods.show_multiPaginator(list);
						},
						'.paginator .multi .active > a': function(e, elm) {
							var
								parent = elm.parents(".multi:first"),
								list = parent.find(".multi-list:first")
								;
							parent.removeClass("open");
							me.methods.hide_multiPaginator(list);
						}
					},
					'clickout': {
						'.paginator .paginator-btn': function(e, elm) {
							var
								parent = elm.parents(".multi:first"),
								list = parent.find(".multi-list:first")
								;
							parent.removeClass("open");
							me.methods.hide_multiPaginator(list);
						}
					}
				},

				controller: {

				}
			},

			methods: {
				init: function() {


				},
				show_multiPaginator: function(list) {
					var top = "-" + (list.outerHeight() / 2) + "px";
					list.css("margin-top", top);
				},
				hide_multiPaginator: function(list) {
					list.css("margin-top", "");
				}
			}

		};
	}
});
