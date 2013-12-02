module.exports = {
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
      '<%= path.css.dist %>/<%= pkg.name %>-viaduct-rtl.css': ['<%= path.less.src %>/packages/viaduct-rtl.less']
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
      '<%= path.css.dist %>/<%= pkg.name %>-viaduct-rtl.min.css': ['<%= path.less.src %>/packages/viaduct-rtl.less']
    }
  }
}
