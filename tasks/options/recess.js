var path = require('path');
module.exports = {
  options: {
    compile: true,
    banner: '<%= banner %>',
    includePath: ['<%= path.less.src %>', 'node_modules']
  },
  bootstrap: {
    files: [{
      expand: true,
      cwd: '<%= path.less.src %>/packages',
      src: ['*.less'],
      ext: '.css',
      dest: '<%= path.css.dist %>',
      rename: function(dest, matchedSrcPath, options) {
         var packageName = matchedSrcPath === 'default.css' ? '<%= pkg.name %>.css' : '<%= pkg.name %>-' + matchedSrcPath;
        return path.join(dest, packageName);
      }
    }]
  }
}
