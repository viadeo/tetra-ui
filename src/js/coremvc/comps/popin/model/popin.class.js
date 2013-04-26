tetra.model.register('popin', {
	scope: 'popin',

	req: {
		fetch: {
			url: '{0}',
			uriParams: ['url'],
			parser: function(resp, col, cond) {
				col[cond.uriParams.url] = {
					id: cond.uriParams.url,
					html: resp.toString(),
					timestamp: cond.timestamp
				};
				return col;
			}
		}
	},

	attr: {
		html: '',
		url: '',
		timestamp: ''
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

});
