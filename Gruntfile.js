module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      uncompressed: {
        options: {
          paths: ['src/less']
        },
        files: {
          'dist/css/tetra-ui.css': ['src/less/packages/default.less'],
          'dist/css/tetra-ui-rtl.css': ['src/less/packages/rtl.less'],
          'dist/css/tetra-ui-light.css': ['src/less/packages/light.less']
        }
      },

      minified: {
        options: {
          paths: ['src/less'],
          compress: true
        },
        files: {
          'dist/css/tetra-ui.min.css': ['src/less/packages/default.less'],
          'dist/css/tetra-ui-doc.min.css': ['src/less/packages/doc.less'],
          'dist/css/tetra-ui-doc-rtl.min.css': ['src/less/packages/doc-rtl.less'],
          'dist/css/tetra-ui-light.min.css': ['src/less/packages/light.less'],
          'dist/css/tetra-ui-rtl.min.css': ['src/less/packages/rtl.less']
        }
      }
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
        evil: true,
        globals: {
          tetra: true,
          Sizzle: true,
          requirejs: true,
          VNS: true,
          module: true,
          exports: true,
          tmpl: true,
          History: true,
          lang: true,
          google: true
        }
      },
      files: [
        "src/js/coremvc/comps/**/*.class.js",
        "src/js/coremvc/comps/**/*.ctrl.js",
        "src/js/coremvc/comps/**/*.ui.js"]
    },

    concat: {
      options: {
        banner: "/*! Tetra UI v<%= pkg.version %> | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */\n\n"
      },

      css: {
        files: {
          'dist/css/tetra-ui.min.css': ['<banner>', 'dist/css/tetra-ui.min.css'],
          'dist/css/tetra-ui-rtl.min.css': ['<banner>', 'dist/css/tetra-ui-rtl.min.css'],
          'dist/css/tetra-ui-doc.min.css': ['<banner>', 'dist/css/tetra-ui-doc.min.css'],
          'dist/css/tetra-ui-doc-rtl.min.css': ['<banner>', 'dist/css/tetra-ui-doc-rtl.min.css'],
          'dist/css/tetra-ui-light.min.css': ['<banner>', 'dist/css/tetra-ui-light.min.css']
        }
      },

      less: {
        files: {
          'dist/less/tetra-ui.less': ['<banner>',
            'src/less/foundation/variables.less',
            'src/less/foundation/mixins.less',
            'src/less/reset.less',
            'src/less/grid.less',
            'src/less/helpers.less',
            'src/less/type.less',
            'src/less/forms.less',
            'src/less/tables.less',
            'src/less/patterns.less',
            'src/less/icons.less',
            'src/less/components/avatars.less',
            'src/less/components/popover.less',
            'src/less/components/tooltip.less',
            'src/less/components/button.less',
            'src/less/components/dropdown.less',
            'src/less/components/popin.less',
            'src/less/components/highlight.less',
            'src/less/components/tabs.less',
            'src/less/components/yesno.less',
            'src/less/components/autocomplete.less',
            'src/less/components/pagination.less',
            'src/less/components/radio.less',
            'src/less/components/checkbox.less',
            'src/less/components/toggle.less',
            'src/less/components/flipswitch.less',
            'src/less/components/box.less',
            'src/less/components/growl.less',
            'src/less/components/card.less',
            'src/less/components/placeholder.less',
            'src/less/components/field-helper.less',
            'src/less/components/steps.less',
            'src/less/components/progressbar.less',
            'src/less/components/share.less',
            'src/less/components/select.less'
          ],

          'dist/less/tetra-ui-apna.less': ['<banner>',
            'src/less/foundation/variables.less',
            'src/less/foundation/variables_apna.less',
            'src/less/foundation/mixins.less',
            'src/less/reset.less',
            'src/less/grid.less',
            'src/less/helpers.less',
            'src/less/type.less',
            'src/less/forms.less',
            'src/less/tables.less',
            'src/less/patterns.less',
            'src/less/icons.less',
            'src/less/components/avatars.less',
            'src/less/components/popover.less',
            'src/less/components/tooltip.less',
            'src/less/components/button.less',
            'src/less/components/dropdown.less',
            'src/less/components/popin.less',
            'src/less/components/highlight.less',
            'src/less/components/tabs.less',
            'src/less/components/yesno.less',
            'src/less/components/autocomplete.less',
            'src/less/components/pagination.less',
            'src/less/components/radio.less',
            'src/less/components/checkbox.less',
            'src/less/components/toggle.less',
            'src/less/components/flipswitch.less',
            'src/less/components/box.less',
            'src/less/components/growl.less',
            'src/less/components/card.less',
            'src/less/components/placeholder.less',
            'src/less/components/field-helper.less',
            'src/less/components/steps.less',
            'src/less/components/progressbar.less',
            'src/less/components/share.less',
            'src/less/components/select.less'
          ],

          'dist/less/tetra-ui-rtl.less': ['<banner>',
            'src/less/foundation/variables.less',
            'src/less/foundation/variables_rtl.less',
            'src/less/foundation/mixins.less',
            'src/less/reset.less',
            'src/less/grid.less',
            'src/less/helpers.less',
            'src/less/type.less',
            'src/less/forms.less',
            'src/less/tables.less',
            'src/less/patterns.less',
            'src/less/icons.less',
            'src/less/components/avatars.less',
            'src/less/components/popover.less',
            'src/less/components/tooltip.less',
            'src/less/components/button.less',
            'src/less/components/dropdown.less',
            'src/less/components/popin.less',
            'src/less/components/highlight.less',
            'src/less/components/tabs.less',
            'src/less/components/yesno.less',
            'src/less/components/autocomplete.less',
            'src/less/components/pagination.less',
            'src/less/components/radio.less',
            'src/less/components/checkbox.less',
            'src/less/components/toggle.less',
            'src/less/components/flipswitch.less',
            'src/less/components/box.less',
            'src/less/components/growl.less',
            'src/less/components/card.less',
            'src/less/components/placeholder.less',
            'src/less/components/field-helper.less',
            'src/less/components/steps.less',
            'src/less/components/progressbar.less',
            'src/less/components/share.less',
            'src/less/components/select.less'
          ],

          'dist/less/tetra-ui-light.less': ['<banner>',
            'src/less/foundation/variables.less',
            'src/less/foundation/mixins.less',
            'src/less/reset.less',
            'src/less/grid.less',
            'src/less/helpers.less',
            'src/less/type.less',
            'src/less/forms.less',
            'src/less/patterns.less',
            'src/less/icons.less',
            'src/less/components/avatars.less',
            'src/less/components/popover.less',
            'src/less/components/tooltip.less',
            'src/less/components/button.less',
            'src/less/components/dropdown.less',
            'src/less/components/popin.less',
            'src/less/components/highlight.less',
            'src/less/components/tabs.less',
            'src/less/components/autocomplete.less',
            'src/less/components/radio.less',
            'src/less/components/box.less',
            'src/less/components/growl.less',
            'src/less/components/placeholder.less',
            'src/less/components/field-helper.less'
          ],
        }
      },

      js: {
        files: {
          'dist/js/conf/tetra-js.js': ['<banner>', 'src/js/conf/tetra-js.js'],
          'dist/js/autocomplete.js': ['<banner>', 'src/js/coremvc/comps/autocomplete/model/autocomplete.class.js', 'src/js/coremvc/comps/autocomplete/controller/autocomplete.ctrl.js', 'src/js/coremvc/comps/autocomplete/view/autocomplete.ui.js'],
          'dist/js/dropdown.js': ['<banner>', 'src/js/coremvc/comps/dropdown/controller/dropdown.ctrl.js', 'src/js/coremvc/comps/dropdown/view/view.ui.js'],
          'dist/js/dropdown_click_enabled.js': ['<banner>', 'src/js/coremvc/comps/dropdown/controller/dropdown.ctrl.js', 'src/js/coremvc/comps/dropdown/view/click_enabled.ui.js'],
          'dist/js/flipswitch.js': ['<banner>', 'src/js/coremvc/comps/flipswitch/controller/flipswitch.ctrl.js', 'src/js/coremvc/comps/flipswitch/view/flipswitch.ui.js'],
          'dist/js/generic_autocomplete.js': ['<banner>', 'src/js/coremvc/comps/generic_autocomplete/model/autocomplete.class.js', 'src/js/coremvc/comps/generic_autocomplete/controller/autocomplete.ctrl.js', 'src/js/coremvc/comps/generic_autocomplete/view/autocomplete.ui.js'],
          'dist/js/growl.js': ['<banner>', 'src/js/coremvc/comps/growl/controller/growl.ctrl.js', 'src/js/coremvc/comps/growl/view/growl.ui.js'],
          'dist/js/navtabs.js': ['<banner>', 'src/js/coremvc/comps/navtabs/model/navtabs.class.js', 'src/js/coremvc/comps/navtabs/controller/navtabs.ctrl.js', 'src/js/coremvc/comps/navtabs/view/navtabs.ui.js'],
          'dist/js/paginator.js': ['<banner>', 'src/js/coremvc/comps/paginator/view/paginator.ui.js'],
          'dist/js/popin.js': ['<banner>', 'src/js/coremvc/comps/popin/model/popin.class.js', 'src/js/coremvc/comps/popin/controller/popin.ctrl.js', 'src/js/coremvc/comps/popin/view/popin.ui.js'],
          'dist/js/file_upload.js': ['<banner>', 'src/js/coremvc/comps/file_upload/model/file_upload.class.js', 'src/js/coremvc/comps/file_upload/controller/file_upload.ctrl.js', 'src/js/coremvc/comps/file_upload/view/file_upload.ui.js'],
          'dist/js/highlight.js': ['<banner>', 'src/js/coremvc/comps/highlight/controller/highlight.ctrl.js', 'src/js/coremvc/comps/highlight/view/highlight.ui.js'],
          'dist/js/maps.js': ['<banner>', 'src/js/coremvc/comps/maps/controller/api.ctrl.js', 'src/js/coremvc/comps/maps/controller/map.ctrl.js','src/js/coremvc/comps/maps/controller/geocode.ctrl.js','src/js/coremvc/comps/maps/controller/itinerary.ctrl.js','src/js/coremvc/comps/maps/controller/places.ctrl.js'],          
          'dist/js/toggle.js': ['<banner>', 'src/js/coremvc/comps/toggle/controller/toggle.ctrl.js', 'src/js/coremvc/comps/toggle/view/toggle.ui.js'],
          'dist/js/yesno.js': ['<banner>', 'src/js/coremvc/comps/yesno/model/yesno.class.js', 'src/js/coremvc/comps/yesno/controller/yesno.ctrl.js', 'src/js/coremvc/comps/yesno/view/yesno.ui.js'],
          'dist/js/placeholder.js': ['<banner>', 'src/js/coremvc/comps/placeholder/view/placeholder.ui.js'],
          'dist/js/iePlaceholder.js': ['<banner>', 'src/js/coremvc/comps/ie/view/iePlaceholder.ui.js'],
          'dist/js/alert.js': ['<banner>', 'src/js/coremvc/comps/alert/view/alert.ui.js'],
          'dist/js/flipbox.js': ['<banner>', 'src/js/coremvc/comps/flipbox/view/flipbox.ui.js'],
          'dist/js/select.js': ['<banner>', 'src/js/coremvc/comps/select/view/select.ui.js']
        }
      }
    },

    uglify: {
      comps: {
        options: {
          banner: "/*! Tetra UI v<%= pkg.version %> | (MIT Licence) (c) Viadeo/APVO Corp - inspired by Bootstrap (c) Twitter, Inc. (Apache 2 Licence) */\n\n",
          report: 'min',
          preserveComments: false
        },
        files: [
          {
            expand: true,
            cwd: 'dist/js/',
            src: ['*.js'],
            dest: 'dist/js/min/',
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
        tasks: ['less', 'concat:css', 'concat:less']
      },
      js: {
        files: ['src/js/coremvc/comps/**/*.js'],
        tasks: ['jshint', 'concat:js', 'uglify']
      },
      doc: {
        files: ['doc/templates/**/*'],
        tasks: ['clean:doc', 'assemble']
      }
    },

    assemble: {
      options: {
        path: '/tetra-ui',
        partials: ['doc/templates/partials/**/*.hbs']
      },
      pages: {
        options: {
          flatten: true,
          layout: 'doc/templates/layouts/default.hbs'
        },
        files: [
          { expand: true, cwd: 'doc/templates/pages', src: ['*.hbs', '!index.hbs'], dest: 'doc/' },
          { expand: true, cwd: 'doc/templates/pages', src: ['index.hbs'], dest: './' }
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('assemble');

  // Default task
  grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify']);

  // Watch and local server
  grunt.registerTask('watch-server', ['connect', 'watch']);

  // Documentation generation with DocPad
  grunt.registerTask('doc', ['clean:doc', 'assemble']);
};