var files = require('../build/profile');

module.exports = {
  js: {
    files: [{
      '<%= path.js.dist %>/vendor/jquery.js': 'bower_components/jquery/dist/jquery.js'
    }]
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
