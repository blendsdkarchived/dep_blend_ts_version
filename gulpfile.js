var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge-stream');
var compass = require('gulp-compass');
var path = require('path');
var print = require('gulp-print');
var fs = require('fs');
var rm = require('gulp-rm')
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var isbuilding = false;

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

gulp.task('clean', function () {
    return merge([
        gulp.src('build', { read: false }).pipe(rm()),
        gulp.src('tests/typings', { read: false }).pipe(rm())
    ]);
});

gulp.task('themes', function () {
    var folders = getFolders('themes');
    var tasks = [];
    folders.map(function (folder) {
        if (folder !== 'etc') {
            tasks.push(gulp.src('themes/' + folder + '/*.scss', { read: false })
                .pipe(compass({
                logging: true,
                project: './',
                sass: 'themes/' + folder + '/sass',
                css: 'build/css/' + folder,
                style: 'compressed'
            })));
        }
    });
    return merge(tasks);
});

gulp.task('blend', ['themes'], function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(ts({
        declarationFiles: true,
        noImplicitAny: true,
        out: 'blend.js'
    }));
    return merge([
        tsResult.dts.pipe(gulp.dest('build/typings')),
        tsResult.dts.pipe(gulp.dest('tests/typings')),
        tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest('build/js'))
    ]);
});

gulp.task('tests', ['blend'], function () {
    var tsResult = gulp.src('tests/src/**/*.ts')
        .pipe(sourcemaps.init({ loadMaps: false }))
        .pipe(ts({
        declarationFiles: true,
        noImplicitAny: true,
        out: 'blend-tests.js'
    }));

    return merge([
        gulp.src('build/js/blend.js').pipe(gulp.dest('build/tests/js')),
        gulp.src('build/css/default/default.css').pipe(gulp.dest('build/tests/css/default/')),
        gulp.src('tests/index.php').pipe(gulp.dest('build/tests/')),
        gulp.src('tests/favicon.ico').pipe(gulp.dest('build/tests/')),
        tsResult.js.pipe(sourcemaps.write({ debug: true })).pipe(gulp.dest('build/tests/js'))
    ]);
});


gulp.task('dist', ['tests'], function () {
    gulp.src('build/js/blend.js')
        .pipe(uglify({
        mangle: false
    }))
        .pipe(rename({
        extname: '.min.js'
    }))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('watch', function () {

    var build = function (task) {
        if (!isbuilding) {
            isbuilding = true;
            gulp.task(task, function () {
                isbuilding = false;
                console.log('done', task);
            });
        }
    }


    gulp.watch(__dirname + '/**/*.ts', function () {
        if(isbuilding === false) {
            console.log('Building dist');
            isbuilding = true;
            gulp.run('dist',function(){
                isbuilding = false;
            });
        }
    });

    gulp.watch(__dirname + '/**/*.scss', function () {
        if(isbuilding === false) {
            console.log('Building themes');
            isbuilding = true;
            gulp.run('themes',function(){
                isbuilding = false;
            });
        }
    });
});

gulp.task('default', ['watch']);