module.exports = {
  compile : {
    options : {
      includePaths: ['<%= path.sass.src %>', 'node_modules']
    },
    files: [{
        expand: true,
        cwd: '<%= path.sass.src %>/packages',
        src: '*.scss',
        dest: '_tmp/css',
        ext: '.css'
      }
    ]
  },
  compile_dist : {
    files: [{
        expand: true,
        cwd: '<%= path.sass.dist %>',
        src: '*.scss',
        dest: '_tmp/css',
        ext: '.css'
      }
    ]
  }
}
