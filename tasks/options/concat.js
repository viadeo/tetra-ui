module.exports = {
  js: {
    files: [{
      '<%= path.js.dist %>/vendor/jquery.js': 'node_modules/jquery/dist/jquery.js',
      '<%= path.js.dist %>/doc/main.js': 'src/js/doc/main.js'
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
      '<%= path.sass.dist %>/<%= pkg.name %>.scss': [
        '<%= path.sass.src %>/foundation/variables.scss',
        '<%= path.css.dist %>/<%= pkg.name %>.css'
      ],
      '<%= path.sass.dist %>/<%= pkg.name %>-rtl.scss': [
        '<%= path.sass.src %>/foundation/variables.scss',
        '<%= path.sass.src %>/foundation/variables_rtl.scss',
        '<%= path.css.dist %>/<%= pkg.name %>-rtl.css'
      ],
    }
  }
}
