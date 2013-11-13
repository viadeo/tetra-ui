module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> |'+
            ' (MIT Licence) (c) Viadeo/APVO Corp -'+
            ' inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */\n\n',

    path : {
      less : {
        src: 'src/less/packages',
        dist:'dist/css'
      },
      js : {
        src: 'src/js/coremvc/comps',
        dist:'dist/js'
      },
      doc : 'doc/templates'
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>',
        includePath: 'src/less'
      },
      bootstrap: {
        files: { 
          '<%= path.less.dist %>/<%= pkg.name %>.css': ['<%= path.less.src %>/default.less'],
          '<%= path.less.dist %>/<%= pkg.name %>-rtl.css': ['<%= path.less.src %>/rtl.less'],
          '<%= path.less.dist %>/<%= pkg.name %>-light.css': ['<%= path.less.src %>/light.less']
        }
      },
      bootstrap_min: {
        options: {
          compress: true
        },
        files: { 
          '<%= path.less.dist %>/<%= pkg.name %>.min.css': ['<%= path.less.src %>/default.less'],
          '<%= path.less.dist %>/<%= pkg.name %>-doc.min.css': ['<%= path.less.src %>/doc.less'],
          '<%= path.less.dist %>/<%= pkg.name %>-doc-rtl.min.css': ['<%= path.less.src %>/doc-rtl.less'],
          '<%= path.less.dist %>/<%= pkg.name %>-rtl.min.css': ['<%= path.less.src %>/rtl.less'],
          '<%= path.less.dist %>/<%= pkg.name %>-light.min.css': ['<%= path.less.src %>/light.less']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        "Gruntfile.js",
        "<%= path.js.src %>/**/*.class.js",
        "<%= path.js.src %>/**/*.ctrl.js",
        "<%= path.js.src %>/**/*.ui.js"]
    },

    concat: {
      js: {
        files: {
          '<%= path.js.dist %>/conf/tetra-js.js': 'src/js/conf/tetra-js.js',
          '<%= path.js.dist %>/autocomplete.js': '<%= path.js.src %>/autocomplete/**/*.js',
          '<%= path.js.dist %>/dropdown.js': '<%= path.js.src %>/dropdown/**/*.js',
          '<%= path.js.dist %>/dropdown_click_enabled.js': '<%= path.js.src %>/dropdown/**/*.js',
          '<%= path.js.dist %>/flipswitch.js': '<%= path.js.src %>/flipswitch/**/*.js',
          '<%= path.js.dist %>/generic_autocomplete.js': '<%= path.js.src %>/generic_autocomplete/**/*.js',
          '<%= path.js.dist %>/growl.js': '<%= path.js.src %>/growl/**/*.js',
          '<%= path.js.dist %>/navtabs.js': '<%= path.js.src %>/navtabs/**/*.js',
          '<%= path.js.dist %>/paginator.js': '<%= path.js.src %>/paginator/**/*.js',
          '<%= path.js.dist %>/popin.js': '<%= path.js.src %>/popin/**/*.js',
          '<%= path.js.dist %>/file_upload.js': '<%= path.js.src %>/file_upload/**/*.js',
          '<%= path.js.dist %>/highlight.js': '<%= path.js.src %>/highlight/**/*.js',
          '<%= path.js.dist %>/maps.js': '<%= path.js.src %>/maps/**/*.js',
          '<%= path.js.dist %>/toggle.js': '<%= path.js.src %>/toggle/**/*.js',
          '<%= path.js.dist %>/yesno.js': '<%= path.js.src %>/yesno/**/*.js', 
          '<%= path.js.dist %>/placeholder.js': '<%= path.js.src %>/placeholder/**/*.js',
          '<%= path.js.dist %>/iePlaceholder.js': '<%= path.js.src %>/ie/**/*.js',
          '<%= path.js.dist %>/alert.js': '<%= path.js.src %>/alert/**/*.js',
          '<%= path.js.dist %>/flipbox.js': '<%= path.js.src %>/flipbox/**/*.js',
          '<%= path.js.dist %>/select.js': '<%= path.js.src %>/select/**/*.js'
        }
      }
    },

    uglify: {
      options: {
        banner: "<%= banner %>"
      },
      beautify : {
        options: {
          mangle: false,
          beautify: true,
          preserveComments: 'some'
        },
        files: [
          {
            expand: true,
            cwd: '<%= path.js.dist %>',
            src: '*.js',
            dest: '<%= path.js.dist %>'
          }
        ]
      },
      dist: {
        options: {
          report: 'min'
        },
        files: [
          {
            expand: true,
            cwd: '<%= path.js.dist %>',
            src: '*.js',
            dest: '<%= path.js.dist %>/min',
            ext: '.min.js'
          }
        ]
      }
    },

    connect: {
      server: {
        options: {
          hostname: '0.0.0.0',
          port: 8080,
          base: '..'
        }
      }
    },

    watch: {
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['recess']
      },
      js: {
        files: ['Gruntfile.js','<%= path.js.src %>/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      },
      doc: {
        files: ['<%= path.doc %>/**/*'],
        tasks: ['clean:doc', 'assemble']
      }
    },

    assemble: {
      options: {
        path: '/<%= pkg.name %>',
        partials: ['<%= path.doc %>/partials/**/*.hbs']
      },
      pages: {
        options: {
          flatten: true,
          layout: '<%= path.doc %>/layouts/default.hbs'
        },
        files: [
          { expand: true, cwd: '<%= path.doc %>/pages', src: ['*.hbs', '!index.hbs'], dest: 'doc/' },
          { expand: true, cwd: '<%= path.doc %>/pages', src: ['index.hbs'], dest: './' }
        ]
      }
    },

    clean: {
      doc: ['doc/*.html', 'index.html']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('assemble');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('dist-js', ['concat', 'uglify']);
  grunt.registerTask('dist-css', ['recess']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

  // Default task
  grunt.registerTask('default', ['test', 'dist']);

  // Generate doc
  grunt.registerTask('doc', ['clean:doc', 'assemble']);

  // Watch and launch server
  grunt.registerTask('watch-server', ['connect', 'watch']);

};