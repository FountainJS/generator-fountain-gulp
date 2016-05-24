const gulp = require('gulp');
const filter = require('gulp-filter');
const useref = require('gulp-useref');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const uglifySaveLicense = require('uglify-save-license');
<% if (framework === 'angular1' && modules === 'inject') { -%>
const inject = require('gulp-inject');
<% } -%>
<% if (framework === 'angular1') { -%>
const ngAnnotate = require('gulp-ng-annotate');
<% } -%>

const conf = require('../conf/gulp.conf');

gulp.task('build', build);

function build() {
<% if (framework === 'angular1' && modules === 'inject') { -%>
  const partialsInjectFile = gulp.src(conf.path.tmp('templateCacheHtml.js'), {read: false});
  const partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: conf.paths.tmp,
    addRootSlash: false
  };

<% } -%>
  const htmlFilter = filter(conf.path.tmp('*.html'), {restore: true});
  const jsFilter = filter(conf.path.tmp('**/*.js'), {restore: true});
  const cssFilter = filter(conf.path.tmp('**/*.css'), {restore: true});

  return gulp.src(conf.path.tmp('/index.html'))
<% if (framework === 'angular1' && modules === 'inject') { -%>
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
<% } -%>
    .pipe(useref())
    .pipe(jsFilter)
    .pipe(sourcemaps.init())
<% if (framework === 'angular1') { -%>
    .pipe(ngAnnotate())
<% } -%>
    .pipe(uglify({preserveComments: uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
    .pipe(rev())
    .pipe(sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(rev())
    .pipe(sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(revReplace())
    .pipe(htmlFilter)
    .pipe(htmlmin())
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(conf.path.dist()));
}
