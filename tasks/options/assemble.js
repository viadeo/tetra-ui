module.exports = {
  options: {
    path: '/<%= pkg.name %>',
    partials: ['<%= path.doc %>/partials/**/*.hbs'],
    flatten: true,
    layout: '<%= path.doc %>/layouts/default.hbs'
  },
  pages: {
    files: [
      { expand: true, cwd: '<%= path.doc %>/pages', src: ['*.hbs', '!index.hbs'], dest: 'doc/' },
      { expand: true, cwd: '<%= path.doc %>/pages', src: ['index.hbs'], dest: './' }
    ]
  }
}
