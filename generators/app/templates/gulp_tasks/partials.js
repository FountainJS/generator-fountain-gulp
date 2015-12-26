const gulp = require('gulp');
const minifyHtml = require('gulp-minify-html');
const angularTemplatecache = require('gulp-angular-templatecache');
<% if (modules !== 'inject') { -%>
const insert = require('gulp-insert');
<% } -%>

const conf = require('../conf/gulp.conf');

gulp.task('partials', partials);

function partials() {
  return gulp.src(conf.path.src('app/**/*.html'))
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(angularTemplatecache('templateCacheHtml.js', {
      module: conf.ngModule,
      root: 'app'
    }))
<% if (modules !== 'inject') { -%>
    .pipe(insert.prepend(`import angular from 'angular';`))
<% } -%>
    .pipe(gulp.dest(conf.path.tmp()));
}
