const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: './build'
        }
    });

    gulp.watch('./build/**/*').on('change', browserSync.reload);
});

gulp.task('compile:templates', function buildHTML() {
    return gulp.src('./source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./build/'))
});

gulp.task('compile:styles', function () {
    return gulp.src('./source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('./source/images/icons/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../images/sprite.png',
            cssName: 'sprite.scss'
        }));
    spriteData.img.pipe(gulp.dest('./build/images/'));
    spriteData.css.pipe(gulp.dest('./source/styles/base/'));
    cb();
});

gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('./build/images/'));
});

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

gulp.task('watch', function () {
    gulp.watch('./source/template/**/*.pug', gulp.series('compile:templates'));
    gulp.watch('./source/styles/**/*.scss', gulp.series('compile:styles'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('compile:templates', 'compile:styles', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);

