module.exports = {
  options: {
    flatten: true,
    partials: ['<%= path.doc %>/partials/**/*.hbs'],
    layout: ['<%= path.doc %>/layouts/default.hbs'],
    data: ['<%= path.doc %>/data/*.{json,yml}'],
    plugins: ['anchors'],
    anchors: {
      template: '<%= path.doc %>/plugins/anchor.js'
    }
  },
  pages: {
    src: ['<%= path.doc %>/pages/*.hbs', '!index.hbs'],
    dest: './doc/'
  },
  index: {
    src: ['<%= path.doc %>/pages/index.hbs'],
    dest: './'
  }
}
