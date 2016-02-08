'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var stringify = require('stringify');
var del = require('del');
var inline = require('gulp-inline');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sassify = require('sassify');

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
    .pipe(autoprefixer({
      browsers: ['Android 4', 'iOS 8'],
      cascade: false
    }))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('inlineHtml', ['js', 'sass'], function() {
  return gulp.src('src/config-page.html')
    .pipe(inline())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeTagWhitespace: true,
      removeRedundantAttributes: true,
      caseSensitive: true,
      minifyJS: true,
      minifyCSS: true
    }))
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

gulp.task('dev-js', ['js', 'sass'], function() {
  return browserify('dev/dev.js', { debug: true, global: true })
    .transform(stringify(['.html', '.tpl']), { global: true })
    .transform('deamdify')
    .transform(sassify, {
      global: true,
      base64Encode: false,
      sourceMap: false,
      sourceMapEmbed: false,
      sourceMapContents: false,
      outputStyle: 'compact',
      includePaths: [].concat(
        require('bourbon').includePaths,
        'src/styles'
      )
    })
    .bundle()
    .pipe(source('dev.js'))
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('default', ['clay']);

gulp.task('dev', ['dev-js'], function() {
  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch(['src/scripts/**/*.js', 'src/templates/**/*.tpl'], ['js']);
  gulp.watch(['dev/**/*.js'], ['dev-js']);
});
