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
					'release/<%=meta.version%>/tetra-ui.css': ['src/less/packages/default.less'],
					'release/<%=meta.version%>/tetra-ui-apna.css': ['src/less/packages/apna.less'],
					'release/<%=meta.version%>/tetra-ui-tianji.css': ['src/less/packages/tianji.less']
				}
			},
			
			production: {
				options: {
					paths: ["src/less"],
					yuicompress: true
				},
				files: {
					'release/<%=meta.version%>/tetra-ui-.min.css': ['src/less/packages/default.less'],
					'release/<%=meta.version%>/tetra-ui-apna.min.css': ['src/less/packages/apna.less'],
					'release/<%=meta.version%>/tetra-ui-tianji.min.css': ['src/less/packages/tianji.less'],
					'release/<%=meta.version%>/tetra-ui-doc.min.css': ['src/less/packages/doc.less'],
					'release/<%=meta.version%>/tetra-ui-doc-tianji.min.css': ['src/less/packages/doc-tianji.less']
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
      files: ['src/less/**/*.less'],
      tasks: 'less concat'
    },

	});

	// Default task.
	grunt.registerTask('default', 'less concat');
	grunt.registerTask('watch-server', 'server watch');
};
