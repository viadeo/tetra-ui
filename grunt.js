module.exports = function( grunt ) {
	grunt.initConfig({
		pkg: "<json:package.json>",
		meta: {
			version: "<%= pkg.version %>",
			banner: "/*! Tetra UI v<%= pkg.version %> | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */"
		},
		recess: {
			tetra-ui: {
				src: [
					'less/foundation.less',
					'less/core.less'
				],
				dest: 'dist/tetra-ui-<%=meta.version%>.js',
				options: {
					compile: true,
					compress: true
				}
			},
			
			tetra-ui-apna: {
				src: [
					'less/foundation_apna.less',
					'less/core.less'
				],
				dest: 'dist/tetra-ui-apna-<%=meta.version%>.js',
				options: {
					compile: true,
					compress: true
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'recess:*');
};
