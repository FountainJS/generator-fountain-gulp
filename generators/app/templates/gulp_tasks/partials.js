const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const angularTemplatecache = require('gulp-angular-templatecache');
<% if (modules !== 'inject') { -%>
const insert = require('gulp-insert');
<% } -%>

const conf = require('../conf/gulp.conf');

gulp.task('partials', partials);

function partials() {
  return gulp.src(conf.path.src('app/**/*.html'))
    .pipe(htmlmin(conf.htmlmin))
<% if (js === 'typescript' && modules !== 'inject') { -%>
    .pipe(angularTemplatecache('templateCacheHtml.ts', {
<% } else { -%>
    .pipe(angularTemplatecache('templateCacheHtml.js', {
<% } -%>
      module: conf.ngModule,
<% if (modules !== 'systemjs') { -%>
      root: 'app'
<% } else { -%>
      root: conf.paths.src + '/app'
<% } -%>
    }))
<% if (modules !== 'inject') { -%>
<%   if (js === 'typescript') { -%>
    .pipe(insert.prepend(`import * as angular from 'angular';`))
<%   } else if (js === 'babel') { -%>
    .pipe(insert.prepend(`import angular from 'angular';`))
<%   } else { -%>
    .pipe(insert.prepend(`var angular = require('angular');`))
<%   } -%>
<% } -%>
    .pipe(gulp.dest(conf.path.tmp()));
}
