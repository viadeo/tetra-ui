// JS packaging
var modules = {

  // HTML 5 Shiv
  '<%= path.js.dist %>/vendor/tetra-js.js': [
    'bower_components/tetra-js/index.js'
  ],

  // JSON Polyfill
  '<%= path.js.dist %>/vendor/json2.js': [
    'bower_components/json2/json2.js'
  ]

};

module.exports = modules;
