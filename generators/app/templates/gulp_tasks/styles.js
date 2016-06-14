const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
<% if (css == 'scss') { -%>
const sass = require('gulp-sass');
<% } -%>
<% if (css == 'less') { -%>
const less = require('gulp-less');
<% } -%>
<% if (css == 'styl') { -%>
const stylus = require('gulp-stylus');
<% } -%>
<% if (sample == 'jhipster' && modules === 'systemjs') { -%>
const flatten = require('gulp-flatten');
<% } -%>
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const conf = require('../conf/gulp.conf');

<% if (sample == 'jhipster' && modules === 'systemjs') { -%>
gulp.task('styles', gulp.parallel(fonts, styles));
<% } else { -%>
gulp.task('styles', styles);
<% } -%>

<% if (sample == 'jhipster' && modules === 'systemjs') { -%>
function fonts() {
  return gulp.src('jspm_packages/github/twbs/**/dist/fonts/*.{ttf,woff,woff2,eof,svg}')
    .pipe(flatten())
    .pipe(gulp.dest(conf.path.dist('fonts')));
}

<% } -%>
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
<%   if (css == 'styl') { -%>
    .pipe(stylus({compress: false})).on('error', conf.errorHandler('Stylus'))
<%   } -%>
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.path.tmp()))
    .pipe(browserSync.stream());
}
