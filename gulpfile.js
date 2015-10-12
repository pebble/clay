'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var stringify = require('stringify');
var del = require('del');
var inline = require('gulp-inline');
var minifyInline = require('gulp-minify-inline');
var minifyHTML = require('gulp-minify-html');

gulp.task('clean', function(done) {
  del(['dist', 'tmp']).then(function() {
    done();
  });
});

gulp.task('browserify', ['clean'], function(done) {
  return browserify('src/scripts/config-page.js', { debug: false })
    .transform(stringify(['.html', '.mustache']))
    .bundle()
    .pipe(source('config-page.js'))
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('inlineHtml', ['clean', 'browserify'], function() {
  return gulp.src('src/config-page.html')
    .pipe(inline())
    .pipe(minifyInline({
      js: {},
      jsSelector: 'script[uglify]'
    }))
    .pipe(minifyHTML())
    .pipe(gulp.dest('tmp/'));
});

gulp.task('clay', ['inlineHtml'], function() {
  return browserify('index.js', { debug: false })
    .transform(stringify(['.html', '.mustache']))
    .require(require.resolve('./index'), {expose: 'pebble-clay'})
    .bundle()
    .pipe(source('clay.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['clay']);
