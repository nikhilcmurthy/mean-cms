var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('less', function () {
    return gulp.src('app/app-content/app.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/app-dist/'));
});

gulp.task('scripts', function () {
    return gulp.src(['app/**/*.js', '!app/app-dist/**/*.js', '!app/app-lib/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/app-dist'));
});

gulp.task('watch', function () {
    gulp.watch('app/app-content/*.less', ['less']);
    gulp.watch(['app/**/*.js', '!app/app-dist/**/*.js'], ['scripts']);
});

gulp.task('default', ['watch', 'scripts', 'less']);