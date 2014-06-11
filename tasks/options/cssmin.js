module.exports = {
  bootstrap: {
    expand: true,
    cwd: '<%= path.css.dist %>',
    src: ['**/*.css'],
    dest: '<%= path.css.dist %>',
    ext: '.min.css'
  }
};
