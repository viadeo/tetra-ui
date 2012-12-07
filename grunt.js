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
					'dist/tetra-ui-<%=meta.version%>.css': ['less/packages/default.less'],
					'dist/tetra-ui-apna-<%=meta.version%>.css': ['less/packages/apna.less'],
					'dist/tetra-ui-tianji-<%=meta.version%>.css': ['less/packages/tianji.less']
				}
			},
			
			production: {
				options: {
					paths: ["less"],
					yuicompress: true
				},
				files: {
					'dist/tetra-ui-<%=meta.version%>.min.css': ['less/packages/default.less'],
					'dist/tetra-ui-apna-<%=meta.version%>.min.css': ['less/packages/apna.less'],
					'dist/tetra-ui-tianji-<%=meta.version%>.min.css': ['less/packages/tianji.less'],
					'dist/tetra-ui-doc-<%=meta.version%>.min.css': ['less/packages/doc.less'],
					'dist/tetra-ui-doc-tianji-<%=meta.version%>.min.css': ['less/packages/doc-tianji.less']
				}
			}
		},

		concat: {
			'dist/tetra-ui-<%=meta.version%>.min.css': ['<banner>', 'dist/tetra-ui-<%=meta.version%>.min.css'],
			'dist/tetra-ui-apna-<%=meta.version%>.min.css': ['<banner>', 'dist/tetra-ui-apna-<%=meta.version%>.min.css'],
			'dist/tetra-ui-doc-<%=meta.version%>.min.css': ['<banner>', 'dist/tetra-ui-doc-<%=meta.version%>.min.css'],
			'dist/tetra-ui-tianji-<%=meta.version%>.min.css': ['<banner>', 'dist/tetra-ui-tianji-<%=meta.version%>.min.css']
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
