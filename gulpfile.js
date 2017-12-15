var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    htmlmin =  require('gulp-htmlmin');
gulp.task('serve',function(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
    gulp.src('*.txt')
        .pipe(gulp.dest('dist/'));
    gulp.src('*.xml')
        .pipe(gulp.dest('dist/'));
});
gulp.task('images', function(){
    gulp.src('images/*.*')
        .pipe(gulp.dest('dist/images'));
});
gulp.task('scripts',function(){
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('watch', function( ){
    gulp.watch('css/*.css',['styles']);
    gulp.watch('*.html')
        .on('change', browserSync.reload);
    gulp.watch('js/*.js', ['scripts'])
        .on('change', browserSync.reload);
});
gulp.task('styles', function( ){
    gulp.src('css/*.css')
        .pipe(gulp.dest('dist/css'));
    gulp.watch('css/*.css')
        .on('change', browserSync.reload);
});
gulp.task('default',['serve','fonts','styles','images','scripts','watch']);