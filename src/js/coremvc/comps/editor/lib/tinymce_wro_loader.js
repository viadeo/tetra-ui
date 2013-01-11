var sTinyMCERegistry = {
	baseURI:"/javascript/coremvc/apps/comp_editor/lib/tiny_mce",

	files: [
		'tiny_mce.js',
		'langs/en.js',
		'themes/advanced/editor_template.js',
		'themes/advanced/langs/en.js'/*,
		
		'themes/advanced/skins/default/ui.css'*/
	],
	registerResources:function() {
		tinymce.baseURL = new tinymce.util.URI(tinymce.documentBaseURL).toAbsolute(this.baseURI);
		tinymce.baseURI = new tinymce.util.URI(tinymce.baseURL);
		for(var i = 0; i < this.files.length; i++) {
			tinymce.ScriptLoader.markDone(tinyMCE.baseURI.toAbsolute(this.files[i]));
		}
	}
};
sTinyMCERegistry.registerResources();