tetra.model.register('yesno', {

	scope: "yesno",

	req: {
		save: {
			url: '{0}',
			uriParams: ['url'],
			method: 'POST'
		},
		del: {
			url: '{0}',
			uriParams: ['url'],
			method: 'POST'
		}
	},
	attr: {
		status: true,
		param: ''
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			},
			setCustom: function(obj) {
				attr[obj.name] = obj.value;
				return this;
			}
		};
	}

});