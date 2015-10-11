// jshint ignore: start
var gulp       = require('gulp'),
    rimraf     = require('rimraf'),
    concat     = require('gulp-concat'),
    sass       = require('gulp-ruby-sass'),
    notify     = require('gulp-notify'),
    uglifycss  = require('gulp-uglifycss'),
    uglify     = require('gulp-uglify');

var config = {
  srcName:  'main',
  libName:  'slate',
  fontPath: './lib/fonts',
  sassPath: './lib/sass',
  extPath:  './external',
  jsPath:   './lib/js',
  distPath: './dist'
};

gulp.task('clean', function(cb) {
  rimraf(config.distPath, cb);
});

gulp.task('css', function() {
  return sass(config.sassPath + '/' + config.srcName + '.scss')
    .on("error", notify.onError(function (error) {
      return "Error: " + error.message;
   }))
    .pipe(concat(config.libName + '.css'))
   .pipe(gulp.dest(config.distPath + '/css'))
    .pipe(concat(config.libName + '.min.css'))
    .pipe(uglifycss())
   .pipe(gulp.dest(config.distPath + '/css'));
});

gulp.task('js', function() {
  return gulp.src([config.extPath + '/*/*.js', config.jsPath + '/*.js'])
    .pipe(concat(config.libName + '.js'))
    .pipe(gulp.dest(config.distPath + '/js'))
    .pipe(uglify())
    .pipe(concat(config.libName + '.min.js'))
    .pipe(gulp.dest(config.distPath + '/js'));
});

gulp.task('fonts', function() {
  return gulp.src(config.fontPath + '/*')
    .pipe(gulp.dest(config.distPath + '/fonts'));
});

gulp.task('build', ['css', 'js', 'fonts']);
gulp.task('default', ['build']);
