'use strict';

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'chai', 'chai-things', 'chai-as-promised'],

    reporters: ['progress', 'coverage'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/jquery/dist/jquery.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/*.js',
      'tests/spec/*.js',
      'src/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      "src/*.js": ['coverage'],
      "src/*Tpl.html": 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'appTemplates'
    },

    // web server port
    port: 9998,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    coverageReporter: {
      type: 'html',
      dir: 'tests/coverage'
    },


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  })
  ;
}
;
