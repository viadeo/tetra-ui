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
      ],
      replacements: [{
        pattern: /tetra-icons\/dist\/(less)\/\_viadeoicons/gi,
        replacement: 'tetra-icons/dist/scss/_viadeoicons',
        order: 10
      }]
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
