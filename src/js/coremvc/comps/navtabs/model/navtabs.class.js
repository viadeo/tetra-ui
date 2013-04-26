tetra.model.register('navtabs', {
	scope: "navtabs",

	req: {
		fetch: {
			url: '{0}',
			uriParams: ['url'],
			parser: function(resp, col, cond) {
				col[cond.uriParams.url] = {id: cond.uriParams.url, targetId: cond.targetId, html: resp.toString()};
				return col;
			}
		}
	},

	attr: {
		html: '',
		targetId: ''
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			}
		};
	}

});