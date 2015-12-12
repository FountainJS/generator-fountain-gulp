const path = require('path');

const gulp = require('gulp');
const filter = require('gulp-filter');
const useref = require('gulp-useref');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const minifyHtml = require('gulp-minify-html');
const sourcemaps = require('gulp-sourcemaps');
const uglifySaveLicense = require('uglify-save-license');
<% if (framework === 'angular1') { -%>
const ngAnnotate = require('gulp-ng-annotate');
const angularTemplatecache = require('gulp-angular-templatecache');
<% } -%>

const conf = require('../conf/gulp.conf');

<% if (framework === 'angular1') { -%>
gulp.task('build', gulp.series(partials, build));

function partials() {
  return gulp.src(pathsJoin(conf.paths.src, '/app/**/*.html'))
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(angularTemplatecache('templateCacheHtml.js', {
      module: 'gulpAngular',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp));
}
<% } else { -%>
gulp.task('build', build);
<% } -%>

function build() {
<% if (framework === 'angular1') { -%>
  const partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/templateCacheHtml.js'), { read: false });
  const partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: conf.paths.tmp,
    addRootSlash: false
  };
<% } -%>

  const htmlFilter = filter('*.html', { restore: true });
  const jsFilter = filter('**/*.js', { restore: true });
  const cssFilter = filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/index.html'))
<% if (framework === 'angular1') { -%>
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
<% } -%>
    .pipe(useref())
    .pipe(jsFilter)
    .pipe(sourcemaps.init())
<% if (framework === 'angular1') { -%>
    .pipe(ngAnnotate())
<% } -%>
    .pipe(uglify({ preserveComments: uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe(rev())
    .pipe(sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(sourcemaps.init())
    .pipe(minifyCss({ processImport: false }))
    .pipe(rev())
    .pipe(sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(revReplace())
    .pipe(htmlFilter)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
}
