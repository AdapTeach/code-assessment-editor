var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    runSequence = require('run-sequence'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    annotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload');


var livereloadport = 35729,
    serverport = 5000;


// DEV SERVER
var devServer = express();
devServer.use(livereload({port: livereloadport}));
devServer.use(express.static('./src'));
devServer.all('/*', function (req, res) {
    res.sendFile('demo/index.html', {root: 'src'});
});


// PATHS
var pathToJsSource = 'src/app/**/*.js',
    pathToTemplates = 'src/app/**/*.tpl.html',
    pathToStyle = 'src/app/style.css',
    pathToDemoJsSource = 'src/demo/**/*.js',
    pathToDemoIndexFile = 'src/demo/index.html';

// DEV
gulp.task('default', ['dev'], function () {
});

gulp.task('dev', [
    'buildDev',
    'startDevServer',
    'watchSource'
], function () {
});

gulp.task('buildDev', [
    'concatJs',
    'cacheTemplates'
], function () {
});

gulp.task('concatJs', function () {
    gulp.src(pathToJsSource)
        .pipe(sourcemaps.init())
        .pipe(concat('all-source.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/build'))
        .pipe(refresh(lrserver));
});

gulp.task('cacheTemplates', function () {
    gulp.src(pathToTemplates)
        .pipe(templateCache({module: 'at.assessment'}))
        .pipe(gulp.dest('src/build'))
});

gulp.task('startDevServer', function () {
    devServer.listen(serverport);
    lrserver.listen(livereloadport);
});

gulp.task('watchSource', function () {
    gulp.watch(pathToJsSource, ['concatJs', 'lint']);
    gulp.watch(pathToDemoJsSource, ['reloadIndex']);
    gulp.watch(pathToDemoIndexFile, ['reloadIndex']);
    gulp.watch(pathToTemplates, ['cacheTemplates', 'reloadIndex']);
    gulp.watch(pathToStyle, ['reloadIndex']);
});

gulp.task('reloadIndex', function () {
    gulp.src(pathToDemoIndexFile)
        .pipe(refresh(lrserver));
});

gulp.task('lint', function () {
    gulp.src(pathToJsSource)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// DIST
gulp.task('dist', ['cacheTemplates'], function () {
        runSequence(
            'cleanBuildFolder',
            'cleanDistFolder',
            'cacheTemplates',
            [
                'distJs',
                'distMinifiedJs',
                'distStyle'
            ]
        );
    }
);

gulp.task('cleanBuildFolder', function (cb) {
    del('src/build', cb);
});

gulp.task('cleanDistFolder', function (cb) {
    del('dist', cb);
});

gulp.task('distJs', function () {
    gulp.src([pathToJsSource, 'src/build/templates.js'])
        .pipe(concat('at-code-assessment.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('distMinifiedJs', function () {
    gulp.src([pathToJsSource, 'src/build/templates.js'])
        .pipe(concat('at-code-assessment-min.js'))
        .pipe(annotate())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('distStyle', function () {
    gulp.src('src/app/style.css')
        .pipe(gulp.dest('dist'));
});