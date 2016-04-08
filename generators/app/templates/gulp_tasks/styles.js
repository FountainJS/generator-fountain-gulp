const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
<% if (css == 'scss') { -%>
const sass = require('gulp-sass');
<% } -%>
<% if (css == 'less') { -%>
const less = require('gulp-less');
<% } -%>
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const conf = require('../conf/gulp.conf');

gulp.task('styles', styles);

function styles() {
<% if (css == 'css') { -%>
  return gulp.src(conf.path.src('**/*.css'))
<% } else { -%>
  return gulp.src(conf.path.src('index.<%- css %>'))
<% } -%>
    .pipe(sourcemaps.init())
<%   if (css == 'scss') { -%>
    .pipe(sass({outputStyle: 'expanded'})).on('error', conf.errorHandler('Sass'))
<%   } -%>
<%   if (css == 'less') { -%>
    .pipe(less({compress: false})).on('error', conf.errorHandler('Less'))
<%   } -%>
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.path.tmp()))
    .pipe(browserSync.stream());
}
