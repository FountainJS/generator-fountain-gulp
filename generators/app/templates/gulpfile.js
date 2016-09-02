const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

<% if (modules === 'inject') { -%>
gulp.task('inject', gulp.series(gulp.parallel('styles', 'scripts'), 'inject'));
<% } -%>
gulp.task('build', <%- buildTask %>);
gulp.task('test', <%- testTask %>);
gulp.task('test:auto', <%- testAutoTask %>);
gulp.task('serve', <%- serveTask %>);
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
<% if (modules === 'inject') { -%>
  gulp.watch([
    conf.path.src('index.html'),
    'bower.json'
  ], gulp.parallel('inject'));

<% } -%>
<% if (framework !== 'react' && modules !== 'webpack') { -%>
<%   if (modules !== 'systemjs') { -%>
  gulp.watch(conf.path.src('app/**/*.html'), reloadBrowserSync);
<%   } else { -%>
  gulp.watch(conf.path.src('**/*.html'), reloadBrowserSync);
<%   } -%>
<% } else if (modules === 'webpack') {-%>
  gulp.watch(conf.path.tmp('index.html'), reloadBrowserSync);
<% } else { -%>
  gulp.watch(conf.path.src('index.html'), reloadBrowserSync);
<% } -%>
<% if (modules !== 'webpack') { -%>
  gulp.watch([
<%   if (css !== 'css') { -%>
    conf.path.src('**/*.<%- css %>'),
<%   } -%>
    conf.path.src('**/*.css')
  ], gulp.series('styles'));
<% } -%>
<% if (modules === 'inject') { -%>
  gulp.watch(conf.path.src('**/*.<%- extensions.js %>'), gulp.series('inject'));
<% } else if (modules === 'systemjs') { -%>
  gulp.watch(conf.path.src('**/*.<%- extensions.js %>'), gulp.series('scripts'));
<% } -%>
  done();
}
