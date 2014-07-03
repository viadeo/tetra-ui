module.exports = {
  less2sass: {
    options: {
      replacements: [
      {
        pattern: /(?!@debug|@mixin|@import|@media|@keyframes|@font-face|@-\w)@/gi,
        replacement: '$'
      },
      /* @IMPORT
        @import "*.less";
        TO =====>
        @import "*";
       */
      {
        pattern: /\@import\s*"(.*).less"/gi,
        replacement: '@import "$1"'
      },
      /* README EXTEND : http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend
        .classname;
         TO =====>
         @extend .classname;
       */
      {
        pattern: /\.([[a-zA-Z-_]*)\s*;/gi,
        replacement: '@extend .$1;'
      },
      /* README CONDITIONS : http://sass-lang.com/documentation/file.SASS_REFERENCE.html#control_directives
        .border-radius-left (@rtl, @size) when (@rtl = false) {
          .border-radius-topleft (@size);
          .border-radius-bottomleft (@size);
        }
        TO =====>
        @if $rtl = false {
          @mixin border-radius-left($rtl, $size){
            @include border-radius-topleft($size);
            @include border-radius-bottomleft($size);
          }
        }
       */
      {
        pattern: /\.([\w\-]*)\s*\((.*)\)\s*when\s*\((.*)=(.*)\)\s*\{(\s*)([^}]+)\}/gi,
        replacement: '@if $3==$4 {$5@mixin $1($2){$5$6}}'
      },
      /* README MIXINS : http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins
        .border-radius-bottomleft (@size) {
         TO =====>
         @mixin border-radius-bottomleft($size) {
       */
      {
        pattern: /\.([\w\-]*)\s*\((.*)\)\s*\{/gi,
        replacement: '@mixin $1($2){'
      },
      /* README INCLUDING MIXINS : http://sass-lang.com/documentation/file.SASS_REFERENCE.html#including_a_mixin
         .border-radius-bottomleft(@size)
         TO =====>
         @include border-radius-bottomleft($size)
       */
      {
        pattern: /(\s+)\.([\w\-]*)\s*\((.*)\)/gi,
        replacement: '$1@include $2($3)'
      },
        /* NESTED INCLUDING MIXINS
            #gradient  >  @include vertical($primaryColor, $secondaryColor);
            #grid > @include gu($rtl);
          TO =====>
            @include gradient-vertical($primaryColor, $secondaryColor);
            @include grid-gu($rtl);
        */
      {
        pattern: /(\s*)\#([\w\-]*)\s*>\s*\@include\s+(.*);/gi,
        replacement: '$1@include $2-$3;'
      },
        /*
            ($rtl, 0) !important;
          TO =====>
            ($rtl, 0 !important);
        */            {
        pattern: /\((.*)\)\s*(!important)/gi,
        replacement: '($1 !important)'
      },
        /*
          README : http://sass-lang.com/documentation/Sass/Script/Functions.html#ie_hex_str-instance_method
        */
      {
        pattern: /e\(%\("progid:DXImageTransform\.Microsoft\.gradient\(startColorstr='%d', endColorstr='%d', GradientType=(\d)\)",(.*),(.*)\)\);/gi,
        replacement: 'progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#{ie-hex-str($2)}\', endColorstr=\'#{ie-hex-str($3)}\', GradientType=$1);'
      },

      {
        pattern: /~"(.*)"/gi,
        replacement: 'unquote("$1")'
      },
        /* README : http://sass-lang.com/documentation/file.SASS_REFERENCE.html#interpolation_
            background: url("${img-buttons-dir}/loaders/default.gif");
          TO =====>
            background: url('#{$img-buttons-dir}/loaders/default.gif');
        */
        // DO IT TWICE to handle multi cases
      {
        pattern: /\$\{(.+)\}/gi,
        replacement: '#{$$$1}'
      },
      {
        pattern: /\$\{(.+)\}/gi,
        replacement: '#{$$$1}'
      },
      {
        pattern: /spin/gi,
        replacement: 'adjust-hue'
      },
      {
        pattern: /shade\(([@|$][\w\d]+),\s?([\d]+%)\)/gmi,
        replacement: 'mix(#000000, $1, $2)'
      },
      {
        pattern: /tint\(([@|$][\w\d]+),\s?([\d]+%)\)/gmi,
        replacement: 'mix(#ffffff, $1, $2)'
      },
        /* README : http://sass-lang.com/documentation/Sass/Script/Functions.html#rgba-instance_method
            box-shadow: 0 0 5px fade(@inputBorderFocus, 40%);
          TO =====>
            box-shadow: 0 0 5px rgba(@inputBorderFocus, (40/100));
        */
      {
        pattern: /fade\((.*),\s*([0-9]{1,3})%\)/gi,
        replacement: 'rgba($1, ($2/100))'
      }
    ]},
    files: [{
        expand: true,
        cwd: '<%= path.less.src %>',
        src: ['**/*.less'],
        dest: '<%= path.sass.src %>',
        ext: '.scss'
      }
    ]
  },
  less2sass_variables: {
    options: {
      replacements: [{
          pattern: /(\$.*);/g,
          replacement: '$1 !default;'
        }
      ]
    },
    files: [{
      '<%= path.sass.src %>/foundation/variables.scss':'<%= path.sass.src %>/foundation/variables.scss',
      },{
      '<%= path.sass.src %>/foundation/variables_rtl.scss':'<%= path.sass.src %>/foundation/variables_rtl.scss'
      }
    ]
  },
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
