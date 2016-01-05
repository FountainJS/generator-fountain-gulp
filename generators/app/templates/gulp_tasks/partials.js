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
    .pipe(angularTemplatecache('templateCacheHtml.<%- js === 'typescript' ? 'ts' : 'js' %>', {
      module: conf.ngModule,
<% if (modules !== 'systemjs') { -%>
      root: 'app'
<% } else { -%>
      root: 'src/app'
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