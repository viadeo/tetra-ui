module.exports = {
  less: {
    files: ['<%= path.less.src %>/**/*.less'],
    tasks: ['recess', 'concat:less', 'concat:sass', 'less2sass']
  },
  js: {
    files: ['Gruntfile.js','<%= path.js.src %>/**/*.js'],
    tasks: ['jshint', 'concat', 'uglify']
  },
  doc: {
    files: ['<%= path.doc %>/**/*'],
    tasks: ['clean:doc', 'assemble']
  }
}
