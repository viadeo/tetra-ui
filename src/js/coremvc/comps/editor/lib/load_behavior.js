function codeInjecter(scope, injectedFunction, insertionPoint){
	if(! 'function' === typeof injectedFunction){
		try{
			injectedFunction = new Function('',injectedFunction);
		}
		catch(err){
			console.warn(err);
		}
	}
	var replacement = undefined;
	this.setUpReplacement = function(rawReplacement){
		replacement = rawReplacement;
	};
	function buildInjection(replaceMode){
		var ending;
		if(replaceMode){
			ending = "}";
		}
		else{
			ending = '';
		}
		var newCode = scope + " = " +
		eval(scope).toString().replace(
			insertionPoint,
			"$1\n" +
			injectedFunction.toString().replace(
				/^function\s+([^(]+)\(([^)]*)\)\s*\{((?:(?:.*)\n)*)\}\s*$/m,
				"$3"
			) +
			ending
		) +
		";";
		if(replacement){
			for(key in replacement){
				newCode = newCode.replace(RegExp("\\b"+key+"\\b",'g'), replacement[key]);
			}
		}
		return newCode;
	}
	this.testInjection = function(){
		
	};
	this.showInjection = function(replaceMode){
		console.warn(buildInjection(replaceMode));
	};
	this.inject = function(replaceMode){
		try{
			eval(buildInjection(replaceMode));
		}
		catch(err){
			console.warn(err);
		}
	};
}


//console.warn(tinymce.ScriptLoader.loadScripts.toString());
tinymce.alreadyLoadedScripts = [
	/\/langs\/en\.js$/,
	/\/themes\/advanced\/editor_template\.js$/,
	/\/themes\/advanced\/langs\/en\.js$/
];
tinymce.testIframeObject = tinymce.Editor;
tinymce.redirectCSS = {
	realInstallationPath: "/javascript/coremvc/apps/comp_editor/lib/tiny_mce/",
	masks: [
		/^.*\/(plugins\/.*\.css)$/,
		/^.*\/(themes\/.*\.css)$/
	]
};


//Script loader behavior modification
var ScriptLoaderReplacement = new codeInjecter(
	"tinymce.dom.ScriptLoader",
	function ScriptLoaderReplacementCode(){
	    for(var i = 0, l = tinymce.alreadyLoadedScripts.length; i < l; i++){
	        if(tinymce.alreadyLoadedScripts[i].match(url)){
	            states[url] = LOADED;
	        }
	    }
	},
	/(tinymce\.each\(loadingScripts,\s*function\s*\(url\)\s*\{)/
);
ScriptLoaderReplacement.inject();
tinymce.ScriptLoader = new tinymce.dom.ScriptLoader();


//Css loader behavior modification
var CssLoaderReplacement = new codeInjecter(
	"tinymce.EditorManager.DOM.loadCSS",
	function CssLoaderReplacementCode(){
		var matches = [];
		for(var i = 0, l = tinymce.redirectCSS.masks.length; i < l; i++){
			matches = u.match(tinymce.redirectCSS.masks[i]);
			switch(matches){
			case null:
				break;
			case undefined:
				break;
			default:
				u  = tinymce.redirectCSS.realInstallationPath + matches[1];
				break;
			}
		}
	},
	/(\s*function\s*\(u\)\s*\{)/
);
CssLoaderReplacement.setUpReplacement({
	each : "tinymce.each",
	is : "tinymce.is",
	isWebKit : "tinymce.isWebKit",
	isIE : "tinymce.isIE",
	Entities : "tinymce.html.Entities",
	simpleSelectorRe : '/^([a-z0-9],?)+$/i',
	whiteSpaceRegExp : '/^[ \t\r\n]*$/'
});
CssLoaderReplacement.inject();

var IframeBuildingReplacement = new codeInjecter(
	"tinymce.Editor.prototype.init",
	function initPatch(){
		if(!/\/themes\/advanced\/skins\/[^\/]+\/content\.css$/.test(t.contentCSS[i])){
			t.iframeHTML += '<link type="text/css" rel="stylesheet" href="' + t.contentCSS[i] + '" />';
		}
	},
	/(for \(i = 0; i < t\.contentCSS\.length; i\+\+\) {)[^}]+\}/
);
IframeBuildingReplacement.setUpReplacement({
	DOM: 'tinymce.DOM',
	Event: 'tinymce.dom.Event',
	extend: 'tinymce.extend',
	each: 'tinymce.each',
	isGecko: 'tinymce.isGecko',
	isIE: 'tinymce.isIE',
	isWebKit: 'tinymce.isWebKit',
	is: 'tinymce.is',
	ThemeManager: 'tinymce.ThemeManager',
	PluginManager: 'tinymce.PluginManager',
	explode: 'tinymce.explode'
});

IframeBuildingReplacement.inject(true);
//tinymce._init();
//window.tinymce = window.tinyMCE = tinymce;
