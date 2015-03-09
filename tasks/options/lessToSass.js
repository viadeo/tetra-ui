module.exports = {
  all: {
    files: [{
      expand: true,
      cwd: '<%= path.less.src %>',
      src: ['**/*.less'],
      ext: '.scss',
      dest: '<%= path.sass.src %>'
    }],
    options: {
      excludes: ['default'],
      ignores: [
        '<%= path.less.src %>/foundation/variables.less'
      ]
    }
  },
  default_variables: {
    files: [{
      expand: true,
      cwd: '<%= path.less.src %>/foundation',
      src: ['variables.less'],
      ext: '.scss',
      dest: '<%= path.sass.src %>/foundation'
    }]
  }
};
