/* jshint node:true */
/* Gulp from HSDF */
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
// var del = require('del');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
// var lazypipe = require('lazypipe');
var runSequence = require('run-sequence');
// var csso = require('gulp-csso');
// var replace = require('gulp-replace');
// var useref = require('gulp-useref');
// var gulpif = require('gulp-if');
// var uglify = require('gulp-uglify');
// var ngAnnotate = require('gulp-ng-annotate');
// var minifyHtml = require('gulp-minify-html');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var CacheBuster = require('gulp-cachebust');
// var size = require('gulp-size');
var wiredep = require('wiredep');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var livereload = require('gulp-livereload');
// var opn = require('opn');
var inject = require('gulp-inject');
// var imagemin = require('gulp-imagemin'),
 //    pngquant = require('imagemin-pngquant');
// var cachebust = new CacheBuster();                   -- important to avoid caching data
var argv = require('yargs').argv;



/** ===================================================================  **/
/** =================    Generic Tasks  ===============================  **/
/** ===================================================================  **/

//STYLES: Compiles less styles into a single css file
gulp.task('styles', function(success) {
    return gulp.src([
        'herams/styles/main.less'
        ])
    .pipe(plumber())
    .pipe(less())
    //.pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('dist/styles'))
    .pipe(gulp.dest('.tmp/styles'));
});

//Copies fonts files into a single folder
gulp.task('fonts', function() {
    return gulp.src(mainBowerFiles().concat('herams/styles/fonts/**/*'))
    .pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('.tmp/fonts'));
});

//WIREDEP: Injects bower dependencies automatically
gulp.task('wiredep', function() {
    var str = wiredep.stream;
    var exclude = [
    '/jquery/',
    'es5-shim',
    'json3',
    'angular-scenario'
    ];

    gulp.src('herams/styles/!*.less')
    .pipe(str())
    .pipe(gulp.dest('herams/styles'));

    gulp.src('herams/!*.html')
    .pipe(str({exclude: exclude}))
    .pipe(gulp.dest('herams'));

    gulp.src('test/!*.js')
    .pipe(str({exclude: exclude, devDependencies: true}))
    .pipe(gulp.dest('test'));

/*
*/
});


//INJECT: Injects automatically developement js files in index
gulp.task('inject', function() {
    var target = gulp.src('herams/index.html');
    var environment;
    switch (argv.environment) {
      case 'dev':
        environment = 'dev';
        break;
      case 'phcpm':
        environment = 'phcpm';
        break;
      default:
        environment = 'amazon';
    }
    var configFolder = 'herams/config/'+environment+'/*.js';

    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['herams/js/**/*.js',configFolder, '!herams/js/app.js'], {read: false});

  return target.pipe(inject(sources,{ignorePath:"herams/",addRootSlash:false}))
    .pipe(gulp.dest('herams'));
});

/** ===============================================================  **/
/** =================    Dev Tasks  ===============================  **/
/** ===============================================================  **/



//CONNECT: Serves file for development
gulp.task('connect', ['styles'], function() {
    var app = connect()
    .use(connectLivereload({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('herams'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use('/node_modules', serveStatic('node_modules'))
    .use(serveIndex('herams'));

    require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
        console.log('Started connect web server (Dev) on http://localhost:9000');
    });

});

//WATCH: Watch for changes to reload the page automatically
gulp.task('watch', function() {
    livereload.listen();

    // watch for changes
    gulp.watch([
        'herams/**/*.html',
        '.tmp/styles/**/*.css',
        'herams/scripts/**/*.js',
        'herams/images/**/*'
        ]).on('change', livereload.changed);

    gulp.watch('herams/styles/**/*.less', ['styles']);
    gulp.watch('bower.json', ['wiredep']);
});

//DEV: prepares files to be served for development
gulp.task('dev', function(callback) {
    argv.environment = 'dev';
    runSequence('inject','wiredep', 'styles', 'connect', 'fonts', 'watch', callback);
});

gulp.task('default', function(callback) {
  runSequence('inject',callback);
});


//SERVEDIST: Serves the dist folder so that the build can be tested
gulp.task('servedist', function() {

    var app = connect()
    .use(serveStatic('dist'))
    .use(serveIndex('dist'));

    require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
        console.log('Started connect web server (Dist) on http://localhost:9000');
    });
});

//DIST: Creates the dist folder that should be released in Prod
gulp.task('dist', function(callback) {
    runSequence('wiredep',
        'inject',
        'clean',
        'html',
        'images',
        'config',
        'fonts',
        'uncache',
        'extras',
        ['gzip'],
        'servedist',
        callback);
});
