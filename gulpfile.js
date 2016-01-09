'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var stringify = require('stringify');
var del = require('del');
var inline = require('gulp-inline');
var minifyInline = require('gulp-minify-inline');
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');

gulp.task('clean-js', function() {
  return del(['tmp/config-page.js']);
});

gulp.task('js', ['clean-js'], function() {
  return browserify('src/scripts/config-page.js', { debug: true })
    .transform(stringify(['.html', '.tpl']))
    .transform('deamdify')
    .bundle()
    .pipe(source('config-page.js'))
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('clean-sass', function() {
  return del(['tmp/config-page.scss']);
});
gulp.task('sass', ['clean-sass'], function() {
  gulp.src('./src/styles/config-page.scss')
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('inlineHtml', ['js', 'sass'], function() {
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
    .transform(stringify(['.html', '.tpl']))
    .require(require.resolve('./index'), {expose: 'pebble-clay'})
    .bundle()
    .pipe(source('clay.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['clay']);

gulp.task('dev', ['js', 'sass'], function() {

  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch(['src/scripts/**/*.js', 'src/templates/**/*.tpl'], ['js']);

  return browserify('dev/dev.js', { debug: true })
    .bundle()
    .pipe(source('dev.js'))
    .pipe(gulp.dest('./tmp/'));
});
