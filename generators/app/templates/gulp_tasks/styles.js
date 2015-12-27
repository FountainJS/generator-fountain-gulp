const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
<% if (css == 'scss') { -%>
const sass = require('gulp-sass');
<% } -%>
const autoprefixer = require('gulp-autoprefixer');

const conf = require('../conf/gulp.conf');

gulp.task('styles', styles);

<% if (css !== 'css') { -%>
function styles() {
  return gulp.src(conf.path.src('index.<%- css %>'))
    .pipe(sourcemaps.init())
<%   if (css == 'scss') { -%>
    .pipe(sass({ style: 'expanded' })).on('error', conf.errorHandler('Sass'))
<%   } -%>
    .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.path.tmp()))
    .pipe(browserSync.stream());
}
<% } else { -%>
function styles(done) {
  $.util.log('Nothing to do for CSS');
  browserSync.reload('*.css');
  done();
}
<% } -%>
