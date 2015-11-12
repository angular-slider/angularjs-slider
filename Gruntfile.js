module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    minBanner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '(c) <%= pkg.author %>, <%= pkg.repository.url %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n',

    recess: {
      options: {
        compile: true
      },

      slider: {
        src: ['src/rzslider.less'],
        dest: 'dist/rzslider.css'
      },

      min: {
        options: {
          compress: true,
          banner: '<%= minBanner %>'
        },
        src: ['dist/rzslider.css'],
        dest: 'dist/rzslider.min.css'
      }
    },

    uglify: {
      options: {
        report: 'min',
        banner: '<%= minBanner %>'
      },
      rzslider: {
        files: {
          'dist/rzslider.min.js': [
            'dist/rzslider.js'
          ]
        }
      }
    },

    ngtemplates: {
      app: {
        src: 'src/**.html',
        dest: 'temp/templates.js',
        options: {
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true, // Only if you don't use comment directives!
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          },
          module: 'rzModule',
          url: function(url) {
            return url.replace('src/', '');
          },
          bootstrap: function(module, script) {
            return 'module.run(function($templateCache) {\n' + script + '\n});';
          }
        }
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [{
            match: /\/\*templateReplacement\*\//,
            replacement: '<%= grunt.file.read("temp/templates.js") %>'
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['src/rzslider.js'],
          dest: 'dist/'
        }]
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      rzslider: {
        files: [{
          'dist/rzslider.js': 'dist/rzslider.js'
        }, {
          expand: true,
          src: ['dist/rzslider.js']
        }]
      }
    },
    watch: {
      all: {
        files: ['dist/*', 'demo/*'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['src/*js', 'src/*.html'],
        tasks: ['js']
      },
      less: {
        files: ['src/*.less'],
        tasks: ['css']
      }
    },
    serve: {
      options: {
        port: 9000
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-serve');

  grunt.registerTask('default', ['css', 'js']);

  grunt.registerTask('css', ['recess']);
  grunt.registerTask('js', ['ngtemplates', 'replace', 'ngAnnotate', 'uglify']);
};
