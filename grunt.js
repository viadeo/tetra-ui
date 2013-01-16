module.exports = function( grunt ) {
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.initConfig({
		pkg: "<json:package.json>",
		
		meta: {
			version: "<%= pkg.version %>",
			banner: "/*! Tetra UI v<%= pkg.version %> | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */"
		},

		less: {
			development: {
				options: {
					paths: ["src/less"]
				},
				files: {
					'release/css/tetra-ui.css': ['src/less/packages/default.less'],
					'release/css/tetra-ui-apna.css': ['src/less/packages/apna.less'],
					'release/css/tetra-ui-tianji.css': ['src/less/packages/tianji.less']
				}
			},
			
			production: {
				options: {
					paths: ["src/less"],
					yuicompress: true
				},
				files: {
					'release/css/tetra-ui.min.css': ['src/less/packages/default.less'],
					'release/css/tetra-ui-apna.min.css': ['src/less/packages/apna.less'],
					'release/css/tetra-ui-tianji.min.css': ['src/less/packages/tianji.less'],
					'release/css/tetra-ui-doc.min.css': ['src/less/packages/doc.less'],
					'release/css/tetra-ui-doc-tianji.min.css': ['src/less/packages/doc-tianji.less']
				}
			}
		},

        lint: {
            files: [
                "src/js/coremvc/comps/**/*.class.js",
                "src/js/coremvc/comps/**/*.ctrl.js",
                "src/js/coremvc/comps/**/*.ui.js"]
        },

        jshint: {
            options: {
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                jquery: true,
                prototypejs: true,
                devel: true,
                smarttabs: true,
                asi: true,
                lastsemic: true,
                evil: true  // For templating
            },
            globals: {
                tetra: true,
                Sizzle: true,
                requirejs: true,
                VNS: true,
                module: true,
                exports: true,
                tmpl: true,
                History: true,
                lang: true
            }
        },

		concat: {
			'release/css/tetra-ui.min.css': ['<banner>', 'release/css/tetra-ui.min.css'],
			'release/css/tetra-ui-apna.min.css': ['<banner>', 'release/css/tetra-ui-apna.min.css'],
			'release/css/tetra-ui-doc.min.css': ['<banner>', 'release/css/tetra-ui-doc.min.css'],
			'release/css/tetra-ui-tianji.min.css': ['<banner>', 'release/css/tetra-ui-tianji.min.css'],

            'release/less/tetra-ui.less': ['<banner>',
                'src/less/foundation/variables.less',
                'src/less/foundation/mixins.less',
                'src/less/reset.less',
                'src/less/grid.less',
                'src/less/helpers.less',
                'src/less/type.less',
                'src/less/forms.less',
                'src/less/tables.less',
                'src/less/patterns.less',
                'src/less/avatars.less',
                'src/less/icons.less',
                'src/less/components/popover.less',
                'src/less/components/tooltip.less',
                'src/less/components/button.less',
                'src/less/components/dropdown.less',
                'src/less/components/popin.less',
                'src/less/components/tabs.less',
                'src/less/components/yesno.less',
                'src/less/components/autocomplete.less',
                'src/less/components/pagination.less',
                'src/less/components/radio.less',
                'src/less/components/toggle.less'
            ],
            'release/less/tetra-ui-apna.less': ['<banner>',
                'src/less/foundation/variables_apna.less',
                'src/less/foundation/mixins.less',
                'src/less/reset.less',
                'src/less/grid.less',
                'src/less/helpers.less',
                'src/less/type.less',
                'src/less/forms.less',
                'src/less/tables.less',
                'src/less/patterns.less',
                'src/less/avatars.less',
                'src/less/icons.less',
                'src/less/components/popover.less',
                'src/less/components/tooltip.less',
                'src/less/components/button.less',
                'src/less/components/dropdown.less',
                'src/less/components/popin.less',
                'src/less/components/tabs.less',
                'src/less/components/yesno.less',
                'src/less/components/autocomplete.less',
                'src/less/components/pagination.less',
                'src/less/components/radio.less',
                'src/less/components/toggle.less'
            ],
            'release/less/tetra-ui-tianji.less': ['<banner>',
                'src/less/foundation/variables_tianji.less',
                'src/less/foundation/mixins.less',
                'src/less/reset.less',
                'src/less/grid.less',
                'src/less/helpers.less',
                'src/less/type.less',
                'src/less/forms.less',
                'src/less/tables.less',
                'src/less/patterns.less',
                'src/less/avatars.less',
                'src/less/icons.less',
                'src/less/components/popover.less',
                'src/less/components/tooltip.less',
                'src/less/components/button.less',
                'src/less/components/dropdown.less',
                'src/less/components/popin.less',
                'src/less/components/tabs.less',
                'src/less/components/yesno.less',
                'src/less/components/autocomplete.less',
                'src/less/components/pagination.less',
                'src/less/components/radio.less',
                'src/less/components/toggle.less'
            ],

            'release/js/autocomplete.js': ['<banner>',
                'src/js/coremvc/comps/autocomplete/model/autocomplete.class.js',
                'src/js/coremvc/comps/autocomplete/controller/autocomplete.ctrl.js',
                'src/js/coremvc/comps/autocomplete/view/autocomplete.ui.js'],

            'release/js/dropdown.js': ['<banner>',
                'src/js/coremvc/comps/dropdown/controller/dropdown.ctrl.js',
                'src/js/coremvc/comps/dropdown/view/view.ui.js'],

            'release/js/dropdown_click_enabled.js': ['<banner>',
                'src/js/coremvc/comps/dropdown/controller/dropdown.ctrl.js',
                'src/js/coremvc/comps/dropdown/view/click_enabled.ui.js'],

            'release/js/flipswitch.js': ['<banner>',
                'src/js/coremvc/comps/flipswitch/controller/flipswitch.ctrl.js',
                'src/js/coremvc/comps/flipswitch/view/flipswitch.ui.js'],

            'release/js/generic_autocomplete.js': ['<banner>',
                'src/js/coremvc/comps/generic_autocomplete/model/autocomplete.class.js',
                'src/js/coremvc/comps/generic_autocomplete/controller/autocomplete.ctrl.js',
                'src/js/coremvc/comps/generic_autocomplete/view/autocomplete.ui.js'],

            'release/js/history.js': ['<banner>',
                'src/js/coremvc/comps/history/controller/history.ctrl.js'],

            'release/js/navtabs.js': ['<banner>',
                'src/js/coremvc/comps/navtabs/model/navtabs.class.js',
                'src/js/coremvc/comps/navtabs/controller/navtabs.ctrl.js',
                'src/js/coremvc/comps/navtabs/view/navtabs.ui.js'],

            'release/js/paginator.js': ['<banner>',
                'src/js/coremvc/comps/paginator/view/paginator.ui.js'],

            'release/js/popin.js': ['<banner>',
                'src/js/coremvc/comps/popin/model/popin.class.js',
                'src/js/coremvc/comps/popin/controller/popin.ctrl.js',
                'src/js/coremvc/comps/popin/view/popin.ui.js'],

            'release/js/toggle.js': ['<banner>',
                'src/js/coremvc/comps/toggle/controller/toggle.ctrl.js',
                'src/js/coremvc/comps/toggle/view/toggle.ui.js'],

            'release/js/yesno.js': ['<banner>',
                'src/js/coremvc/comps/yesno/model/yesno.class.js',
                'src/js/coremvc/comps/yesno/controller/yesno.ctrl.js',
                'src/js/coremvc/comps/yesno/view/yesno.ui.js']
		},

        server: {
          port: 8080,
          base: '..'
        },

        watch: {
          files: ['src/less/**/*.less'],
          tasks: 'less concat'
        }
    });

	// Default task.
	grunt.registerTask('default', 'lint less concat');
	grunt.registerTask('watch-server', 'server watch');
};