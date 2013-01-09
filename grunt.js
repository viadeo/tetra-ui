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
					paths: ["less"]
				},
				files: {
					'release/<%=meta.version%>/tetra-ui.css': ['less/packages/default.less'],
					'release/<%=meta.version%>/tetra-ui-apna.css': ['less/packages/apna.less'],
					'release/<%=meta.version%>/tetra-ui-tianji.css': ['less/packages/tianji.less']
				}
			},
			
			production: {
				options: {
					paths: ["less"],
					yuicompress: true
				},
				files: {
					'release/<%=meta.version%>/tetra-ui-.min.css': ['less/packages/default.less'],
					'release/<%=meta.version%>/tetra-ui-apna.min.css': ['less/packages/apna.less'],
					'release/<%=meta.version%>/tetra-ui-tianji.min.css': ['less/packages/tianji.less'],
					'release/<%=meta.version%>/tetra-ui-doc.min.css': ['less/packages/doc.less'],
					'release/<%=meta.version%>/tetra-ui-doc-tianji.min.css': ['less/packages/doc-tianji.less']
				}
			}
		},

		concat: {
			'release/<%=meta.version%>/tetra-ui.min.css': ['<banner>', 'release/<%=meta.version%>/tetra-ui.min.css'],
			'release/<%=meta.version%>/tetra-ui-apna.min.css': ['<banner>', 'release/<%=meta.version%>/tetra-ui-apna.min.css'],
			'release/<%=meta.version%>/tetra-ui-doc.min.css': ['<banner>', 'release/<%=meta.version%>/tetra-ui-doc.min.css'],
			'release/<%=meta.version%>/tetra-ui-tianji.min.css': ['<banner>', 'release/<%=meta.version%>/tetra-ui-tianji.min.css']
		},

    server: {
      port: 8080,
      base: '..'
    },

    watch: {
      files: ['less/**/*.less'],
      tasks: 'less concat'
    },

	});

	// Default task.
	grunt.registerTask('default', 'less concat');
	grunt.registerTask('watch-server', 'server watch');
};
