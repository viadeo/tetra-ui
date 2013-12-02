module.exports = {
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
}
