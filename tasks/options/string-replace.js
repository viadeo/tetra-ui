module.exports = {
  sass_dist: {
    options: {
      replacements: [{
          pattern: /filter: alpha\(opacity=([0-9]{1,3})\)/gi,
          replacement: 'filter: unquote(\'alpha(opacity=$1)\')'
        }
      ]
    },
    files: [{
        expand: true,
        cwd: '<%= path.sass.dist %>',
        src: ['*.scss'],
        dest: '<%= path.sass.dist %>',
        ext: '.scss'
      }
    ]
  },
  less_dist: {
    options: {
      replacements: [{
          pattern: /filter: alpha\(opacity=([0-9]{1,3})\)/gi,
          replacement: 'filter: ~"alpha(opacity=$1)"'
        }
      ]
    },
    files: [{
        expand: true,
        cwd: '<%= path.less.dist %>',
        src: ['*.less'],
        dest: '<%= path.less.dist %>',
        ext: '.less'
      }
    ]
  }
};
