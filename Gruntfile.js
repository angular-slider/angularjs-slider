module.exports = function (grunt)
{
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
        src: ['rzslider.less'],
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
            'rzslider.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');

  grunt.registerTask('default', ['css', 'js']);

  grunt.registerTask('css', ['recess']);
  grunt.registerTask('js', ['uglify']);
};
