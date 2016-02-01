'use strict';

// Karma configuration

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '..',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'source-map-support', 'mocha'],

    browserify: {
      debug: true,
      transform: [
        [
          'stringify',
          { extensions: ['.html', '.tpl'] }
        ],
        'deamdify',
        [
          'browserify-istanbul',
          {
            ignore: process.env.DEBUG ?
              ['**/**'] :
              ['**/test/**', '**/src/scripts/vendor/**']
          }
        ]
      ]
    },

    // list of files / patterns to load in the browser
    files: [
      'src/scripts/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/scripts/**/*.js': ['browserify'],
      'test/spec/**/*.js': ['browserify']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: process.env.DEBUG ?
      ['mocha'] :
      ['mocha', 'coverage', 'threshold'],

    // optionally, configure the reporter
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'text-summary'},
        {type: 'html', subdir: '.'}
      ]
    },

    thresholdReporter: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // set via the command line
    customLaunchers: {
      chromeTravisCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};

