const path = require('path');

const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([
  'gulp_tasks/misc.js',
  'gulp_tasks/build.js',
  'gulp_tasks/styles.js',
  'gulp_tasks/scripts.js',
<% if (modules === 'inject') { -%>
  'gulp_tasks/inject.js',
<% } -%>
  'gulp_tasks/browserSync.js',
  'gulp_tasks/karma.js',
  'gulp_tasks/protractor.js'
]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

<% if (modules === 'inject') { -%>
gulp.task('inject', gulp.series(gulp.parallel('styles', 'scripts'), 'inject'));
<% } -%>
gulp.task('build', gulp.series(<%- compileTask %>, 'other', 'build'));

<% if (modules === 'inject') { -%>
gulp.task('test', gulp.series('scripts', 'karma:single-run'));
gulp.task('test:auto', gulp.series(watch, 'karma:auto-run'));
<% } else { -%>
gulp.task('test', gulp.series('karma:single-run'));
gulp.task('test:auto', gulp.series('karma:auto-run'));
<% } -%>
gulp.task('serve', gulp.series(<%- compileTask %>, watch, 'browser-sync'));
gulp.task('serve:dist', gulp.series('default', 'browser-sync:dist'));
gulp.task('default', gulp.series('clean', 'build'));

function watch(done) {
<% if (modules === 'inject') { -%>
  gulp.watch([
    path.join(conf.paths.src, '/*.html'),
    'bower.json'
  ], gulp.parallel('inject'));

<% } -%>
  gulp.watch([
<% if (css !== 'css') { -%>
    path.join(conf.paths.src, '/app/**/*.<%- css %>'),
<% } -%>
    path.join(conf.paths.src, '/app/**/*.css')
  ], gulp.series('styles'));

<% if (modules === 'inject') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), gulp.series('scripts', 'inject'));

<% } else if (modules === 'systemjs') { -%>
  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), gulp.series('scripts'));

<% } -%>
  done();
}
