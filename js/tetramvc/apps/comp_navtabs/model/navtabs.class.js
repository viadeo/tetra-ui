tetra.model.register('navtabs', {

    scope: "comp_navtabs",
    
	req : {
		save : {
			url : '{0}',
			uriParams: ['url'],
			method: 'GET',
			parser : function(resp, col, cond) {
				col[cond.uriParams.url] = {id: cond.uriParams.url, html: resp.toString()};
				return col;
			}
		}
	},
	
	attr : {
		html : '',
		targetId: '',
		url : ''
	},
	
	methods : function(attr) { return {
		validate : function(attr, errors){
			return errors;
		}
	};}

});