(function(){

	"use strict";

	// Setup the core default values
	tetra.extend({
		conf: {
			jsVersion: 'test',
			enableBootnode: true,
			disableCtrlInit: true,
			disableViewInit: true,
			APPS_PATH: "/src/js/coremvc/comps",
			GLOBAL_PATH: "/src/js/coremvc/models"
		}
	}).start();

	// Enable debug mode, with a random string to suppress console messages
	tetra.debug.enable("blarg");
})();