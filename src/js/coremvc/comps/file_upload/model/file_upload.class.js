tetra.model.register('file_upload', {
	scope: 'file_upload',

	req: {
		save : {
			url : '{0}',
			uriParams: ['url'],
			method : 'POST',
			processData: false,
			contentType : false
		}
	},

	attr: {
		data: ''
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			}
		};
	}

});