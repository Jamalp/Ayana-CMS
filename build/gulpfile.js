var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-combine-media-queries');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var order = require("gulp-order");
var notify = require('gulp-notify');
gulp.task('reload',function(){
  browserSync.reload();
});
gulp.task('sass',function(){
  gulp.src(['src/styles/style.scss'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(autoPrefixer())
    .pipe(cssComb())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('../public/assets/css/'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('../public/assets/css/'))
    .pipe(browserSync.stream())
    .pipe(notify('css task finished'));
});
gulp.task('js',function(){
  gulp.src(['src/scripts/**/*.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(order([
      // 'assets/scripts/lib/jquery.min.js',
      // 'assets/scripts/lib/velocity.js',
      // 'assets/scripts/lib/velocity-ui.js',
      // 'assets/scripts/lib/slick.js',
      'assets/scripts/lib/*.js',
      'assets/scripts/modules/helpers.js',
      'assets/scripts/modules/*.js',
      'assets/scripts/pages/*.js'
    ], { base: './' }))
    .pipe(concat('app.js'))
    .pipe(jshint())
      .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('../public/assets/scripts'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('../public/assets/scripts'))
      .pipe(notify('js task finished'));
});
gulp.task('default',function(){
  browserSync.init({
      
        proxy: "http://192.168.33.10/",
        notify: false
    });
  gulp.watch('src/scripts/**/*.js',['js','reload']);
  gulp.watch('src/scss/**/*.scss',['sass']);
  gulp.watch('../craft/templates/**/*.html',['reload']);
  gulp.watch('../public/assets/images/*',['reload']);
});
