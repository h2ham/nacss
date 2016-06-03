'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var cp = require('child_process');
var config = require('./gulp/config');

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src([
      config.resource_dir + '/**/*.js',
      '!' + config.resource_dir + '/common/js/vendor/*'
    ])
    .pipe($.jshint())
    .pipe($.jscs())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('copy:fonts', function() {
  return gulp.src([
      config.resource_dir + '/common/fonts/**/*'
    ])
    .pipe(gulp.dest(config.dest_dir + '/common/fonts'))
    .pipe($.if(config.dev, browserSync.stream()));
});

gulp.task('scripts', ['jshint'], function () {
  return gulp.src([
      config.resource_dir + '/common/js/vendor/jquery.js',
      config.resource_dir + '/common/js/vendor/!(jquery.js)*',
      config.resource_dir + '/common/js/functions.js'
    ])
    // .pipe($.plumber())
    .pipe($.concat(config.js_concat_name))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe(gulp.dest(config.dest_dir + '/common/js'))
    .pipe($.size({title: 'scripts'}))
    .pipe($.if(config.dev, browserSync.stream()));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src([config.resource_dir + '/**/*.{jpg,gif,png}'])
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(config.dest_dir))
    .pipe($.size({title: 'images'}));
});


gulp.task('styles:main', function () {
  return gulp.src([
      config.resource_dir + '/**/*.scss'
    ])
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({'browsers': config.autoprefixer_browsers}))
    .pipe($.if('*.css', $.csscomb()))
    .pipe(gulp.dest(config.dest_dir))
    .pipe($.size({title: 'css'}))
    .pipe($.if(config.dev, browserSync.stream()));
});

gulp.task('styles', ['styles:main']);


gulp.task('metalsmith-build', function (done) {
  return cp.spawn('npm', ['run','metalsmith'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('html', ['metalsmith-build'], function () {
  return gulp.src([config.tmp + '/**/*.html'])
    .pipe(gulp.dest(config.open_dir))
    .pipe($.size({title: 'html'}))
    .pipe($.if(config.dev, browserSync.stream()));
});

gulp.task('clean', function (cb) {
  del([config.dest_dir, config.tmp], {
    dots: true,
    force: true
  }).then(function() {
    return $.cache.clearAll(cb);
  });
});

gulp.task('server', ['scripts', 'html', 'images', 'styles:main', 'copy:fonts'], function () {
  browserSync.init({
    notify: false,
    open: "external",
    host: "127.0.0.1",
    server: {
      baseDir: config.open_dir
    }
  });

  gulp.watch([
    config.resource_dir + '/**/*.html',
    '!' + config.resource_dir + '/common/js/**/*'
  ], ['html']);
  gulp.watch([config.resource_dir + '/**/*.{scss,css}'], ['styles:main']);
  gulp.watch([config.resource_dir + '/**/*.js'], ['scripts']);
  // gulp.watch([config.resource_dir + '/common/fonts/**/*'], ['copy:fonts']);
  gulp.watch([config.resource_dir + '/**/*.{jpg,gif,png}'], ['images', browserSync.reload]);

});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  config.dev = false;
  runSequence('styles',  ['scripts', 'html', 'images', 'styles:main', 'copy:fonts'], cb);
});
