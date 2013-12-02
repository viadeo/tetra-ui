module.exports = {
  options: {
    jshintrc: '.jshintrc'
  },
  files: [
    "Gruntfile.js",
    "<%= path.js.src %>/**/*.class.js",
    "<%= path.js.src %>/**/*.ctrl.js",
    "<%= path.js.src %>/**/*.ui.js"
  ]
}
