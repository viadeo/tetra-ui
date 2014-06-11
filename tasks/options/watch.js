module.exports = {
  less: {
    files: ['<%= path.less.src %>/**/*.less'],
    tasks: ['recess:bootstrap']
  },
  js: {
    files: ['Gruntfile.js','<%= path.js.src %>/**/*.js'],
    tasks: ['jshint', 'concat:js']
  },
  doc: {
    files: ['<%= path.doc %>/**/*'],
    tasks: ['clean:doc', 'assemble']
  }
}
