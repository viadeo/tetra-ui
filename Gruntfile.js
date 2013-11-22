module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({

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
        src: 'src/js/coremvc/comps',
        dist:'dist/js'
      },
      doc : 'doc/templates'
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>',
        includePath: '<%= path.less.src %>'
      },
      bootstrap: {
        files: {
          '<%= path.css.dist %>/<%= pkg.name %>.css': ['<%= path.less.src %>/packages/default.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-rtl.css': ['<%= path.less.src %>/packages/rtl.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-light.css': ['<%= path.less.src %>/packages/light.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-viaduct.css': ['<%= path.less.src %>/packages/viaduct.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-viaduct-rtl.css': ['<%= path.less.src %>/packages/viaduct-rtl.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-viaduct-light.css': ['<%= path.less.src %>/packages/viaduct-light.less']
        }
      },
      bootstrap_min: {
        options: {
          compress: true
        },
        files: {
          '<%= path.css.dist %>/<%= pkg.name %>.min.css': ['<%= path.less.src %>/packages/default.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-doc.min.css': ['<%= path.less.src %>/packages/doc.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-doc-rtl.min.css': ['<%= path.less.src %>/packages/doc-rtl.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-rtl.min.css': ['<%= path.less.src %>/packages/rtl.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-light.min.css': ['<%= path.less.src %>/packages/light.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-viaduct.min.css': ['<%= path.less.src %>/packages/viaduct.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-viaduct-rtl.min.css': ['<%= path.less.src %>/packages/viaduct-rtl.less'],
          '<%= path.css.dist %>/<%= pkg.name %>-viaduct-light.min.css': ['<%= path.less.src %>/packages/viaduct-light.less']
        }
      }
    },

    'string-replace': {
      less2sass: {
        options: {
          replacements: [{
              pattern: /@/g,
              replacement: '$'
            },
            {
              pattern: /\.([\w\-]*)\s*\((.*)\)\s*\{/gi,
              replacement: '@mixin $1($2)\n{'
            },
            {
              pattern: /\.([\w\-]*\(.*\)\s*)/gi,
              replacement: '@include $1'
            },
            {
              pattern: /~"(.*)"/gi,
              replacement: '#{$1}'
            },
            {
              pattern: /spin/gi,
              replacement: 'adjust-hue'
            },
            {
              pattern: /shade/gi,
              replacement: 'darken'
            },
            {
              pattern: /tint/gi,
              replacement: 'lighten'
            }
          ]
        },
        files: [{
            expand: true,
            cwd: '<%= path.less.src %>/foundation',
            src: ['*.less', '!mixins.less'],
            dest: '<%= path.sass.src %>/foundation',
            ext: '.scss'
          }
        ]
      },
      sass_dist: {
        options: {
          replacements: [{
              pattern: /filter: alpha\(opacity=([0-9]{1,3})\)/gi,
              replacement: 'filter: #{"alpha(opacity=$1)"}'
            }
          ]
        },
        files: [{
            expand: true,
            cwd: '<%= path.sass.dist %>',
            src: ['*.scss'],
            dest: '<%= path.sass.dist %>',
            ext: '.scss'
          }
        ]
      },
      less_dist: {
        options: {
          replacements: [{
              pattern: /filter: alpha\(opacity=([0-9]{1,3})\)/gi,
              replacement: 'filter: ~"alpha(opacity=$1)"'
            }
          ]
        },
        files: [{
            expand: true,
            cwd: '<%= path.less.dist %>',
            src: ['*.less'],
            dest: '<%= path.less.dist %>',
            ext: '.less'
          }
        ]
      }
    },

    sass: {
      compile : {
        files: [{
            expand: true,
            cwd: '<%= path.sass.src %>/foundation/',
            src: '*.scss',
            dest: '_tmp/css',
            ext: '.css'
          }
        ]
      },
      compile_dist : {
        files: [{
            expand: true,
            cwd: '<%= path.sass.dist %>',
            src: '*.scss',
            dest: '_tmp/css',
            ext: '.css'
          }
        ]
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
          '<%= path.js.dist %>/dropdown.js': ['<%= path.js.src %>/dropdown/**/*.js','!<%= path.js.src %>/dropdown/view/click_enabled.ui.js'],
          '<%= path.js.dist %>/dropdown_click_enabled.js': '<%= path.js.src %>/dropdown/view/click_enabled.ui.js',
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
      },
      less: {
        options: {
          banner: "<%= banner %>"
        },
        files: {
          '<%= path.less.dist %>/<%= pkg.name %>.less': [
            '<%= path.less.src %>/foundation/variables.less',
            '<%= path.less.src %>/foundation/mixins.less',
            '<%= path.css.dist %>/<%= pkg.name %>.css'
          ],
          '<%= path.less.dist %>/<%= pkg.name %>-light.less': [
            '<%= path.less.src %>/foundation/variables.less',
            '<%= path.less.src %>/foundation/mixins.less',
            '<%= path.css.dist %>/<%= pkg.name %>-light.css'
          ],
          '<%= path.less.dist %>/<%= pkg.name %>-rtl.less': [
            '<%= path.less.src %>/foundation/variables.less',
            '<%= path.less.src %>/foundation/variables_rtl.less',
            '<%= path.less.src %>/foundation/mixins.less',
            '<%= path.css.dist %>/<%= pkg.name %>-rtl.css'
          ],
        }
      },
      sass: {
        options: {
          banner: "<%= banner %>"
        },
        files: {
          '<%= path.sass.dist %>/<%= pkg.name %>-viaduct.scss': [
            '<%= path.sass.src %>/foundation/variables.scss',
            '<%= path.sass.src %>/foundation/variables_viaduct.scss',
            '<%= path.css.dist %>/<%= pkg.name %>-viaduct.css'
          ],
          '<%= path.sass.dist %>/<%= pkg.name %>-viaduct-light.scss': [
            '<%= path.sass.src %>/foundation/variables.scss',
            '<%= path.sass.src %>/foundation/variables_viaduct.scss',
            '<%= path.css.dist %>/<%= pkg.name %>-viaduct-light.css'
          ],
          '<%= path.sass.dist %>/<%= pkg.name %>-viaduct-rtl.scss': [
            '<%= path.sass.src %>/foundation/variables.scss',
            '<%= path.sass.src %>/foundation/variables_viaduct.scss',
            '<%= path.sass.src %>/foundation/variables_rtl.scss',
            '<%= path.css.dist %>/<%= pkg.name %>-viaduct-rtl.css'
          ],
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
        files: ['<%= path.less.src %>/**/*.less'],
        tasks: ['recess', 'concat:less', 'concat:sass', 'less2sass']
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
      doc: ['doc/*.html', 'index.html'],
      sass: ['<%= path.sass.src %>'],
      tmp: ['_tmp/css']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('assemble');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('test-sass', ['sass:compile','sass:compile_dist']);

  grunt.registerTask('less2sass', [
    'clean:sass',
    'string-replace:less2sass',
    'string-replace:sass_dist',
    'string-replace:less_dist',
    'test-sass'
  ]);

  grunt.registerTask('dist-js', ['concat:js', 'uglify']);

  grunt.registerTask('dist-css', [
    'clean:tmp',
    'recess',
    'concat:less',
    'concat:sass',
    'less2sass'
  ]);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js']);

  // Default task
  grunt.registerTask('default', ['test', 'dist']);

  // Generate doc
  grunt.registerTask('doc', ['clean:doc', 'assemble']);

  // Watch and launch server
  grunt.registerTask('watch-server', ['connect', 'watch']);

};