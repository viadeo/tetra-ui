module.exports = {
  less: {
    files: ['<%= path.less.src %>/**/*.less'],
    tasks: ['recess:bootstrap', 'concat:less']
  },
  js: {
    files: ['Gruntfile.js','<%= path.js.src %>/**/*.js'],
    tasks: ['jshint', 'concat:js', 'uglify']
  },
  doc: {
    files: ['<%= path.doc %>/**/*'],
    tasks: ['clean:doc', 'assemble']
  }
}
