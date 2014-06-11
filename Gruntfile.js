var
  loadGruntConfig = require('load-grunt-config'),
  _ = require('lodash')
;

module.exports = function(grunt) {
  "use strict";
  var config = loadGruntConfig(grunt, {
    configPath: __dirname + '/tasks/options',
    init: false,
    loadGruntTasks: {
      scope: 'devDependencies'
    }
  });

  var initConfig = {
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy") %> |'+
            ' (MIT Licence) (c) Viadeo/APVO Corp -'+
            ' inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */\n\n',
    path : {
      less : {
        src: 'src/less',
        dist:'dist/less'
      },
      sass : {
        src: 'src/sass',
        dist:'dist/sass'
      },
      css : {
        dist:'dist/css'
      },
      js : {
        src: 'src/js/',
        dist:'dist/js'
      },
      doc : 'doc/templates'
    }
  };

  // Merge configurations
  grunt.initConfig(_.merge(initConfig, config));

  // Force load assemble
  grunt.loadNpmTasks('assemble');

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('test-sass', [
    'sass:compile',
    'sass:compile_dist'
  ]);

  grunt.registerTask('less2sass', [
    'clean:sass',
    'string-replace:less2sass',
    'string-replace:sass_dist',
    'string-replace:less_dist',
    'test-sass'
  ]);

  grunt.registerTask('dist-js', [
    'concat:js',
    'uglify'
  ]);

  grunt.registerTask('dist-css', [
    'clean:tmp',
    'recess',
    'concat:less',
    'less2sass',
    'concat:sass',
    'cssmin'
  ]);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

  // Generate doc
  grunt.registerTask('doc', ['clean:doc', 'assemble']);

  // Watch and launch server
  grunt.registerTask('watch-server', ['connect', 'watch']);

    // Default task
  grunt.registerTask('default', ['test', 'dist', 'doc', 'watch-server']);

};
