// This model gives back sets of suggestions, from a DOM-specified resource
// So for each query a different set is received and cached
// retrieving one suggestion means knowing its set's reference AND its server-side id

tetra.model.register('suggestions', {
	scope: 'autocomplete',

	req: {
		fetch: {
			url: '{0}',
			uriParams: ['url'],
			parser: function(resp, col, cond) {
				resp.id = cond.id;
				col[cond.uriParams.url] = {
					id: cond.id,
					suggestions: resp
				};
				return col;
			}
		}
	},

	attr: {
		suggestions: {}
	},

	methods: function(attr) {
		return {
			validate: function(attr, errors) {
				return errors;
			}
		};
	}

});