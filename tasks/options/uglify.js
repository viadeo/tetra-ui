module.exports = {
  dist : {
    files: [
      {
        expand: true,
        cwd: '<%= path.js.dist %>',
        src: '**/*.js',
        dest: '<%= path.js.dist %>'
      }
    ]
  }
}
