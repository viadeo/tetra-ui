var files = require('../build/profile');

module.exports = {
  js: {
    files: [{
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
    },
    files
    ]
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
}
