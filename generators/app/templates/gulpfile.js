const path = require('path');

const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry(<%- json(gulpFiles) %>);

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

function watch(done) {
<% if (modules === 'inject') { -%>
  gulp.watch([
    path.join(conf.paths.src, '**/*.html'),
    'bower.json'
  ], gulp.parallel('inject'));

<% } -%>
  gulp.watch([
<% if (css !== 'css') { -%>
    path.join(conf.paths.src, '**/*.<%- css %>'),
<% } -%>
    path.join(conf.paths.src, '**/*.css')
  ], gulp.series('styles'));

<% if (modules === 'inject') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.<%- extensions.js %>'), gulp.series('scripts', 'inject'));

<% } else if (modules === 'systemjs') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.<%- extensions.js %>'), gulp.series('scripts'));

<% } -%>
  done();
}
