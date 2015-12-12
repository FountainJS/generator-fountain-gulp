const path = require('path');

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
<%   if (css == 'scss') { -%>
  const sassOptions = {
    style: 'expanded'
  };
<%   } -%>

  return gulp.src([
    path.join(conf.paths.src, '/app/index.<%- css %>')
  ])
    .pipe(sourcemaps.init())
<%   if (css == 'scss') { -%>
    .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass'))
<%   } -%>
    .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}
<% } else { -%>
function styles(done) {
  $.util.log('Nothing to do for CSS');
  browserSync.reload('*.css');
  done();
}
<% } -%>
