const test = require('ava');

const gulpfileConf = require('../../../generators/app/conf');

test('gulpfileConf with react/webpack', t => {
  const expected = {
    modules: 'webpack',
    framework: 'react',
    buildTask: `gulp.series(gulp.parallel('other', 'webpack:dist'))`,
    serveTask: `gulp.series('webpack:watch', 'watch', 'browsersync')`,
    testTask: `gulp.series('karma:single-run')`,
    testAutoTask: `gulp.series('karma:auto-run')`
  };
  const options = gulpfileConf({modules: expected.modules, framework: expected.framework});
  t.deepEqual(options, expected);
});

test('gulpfileConf with angular1/webpack', t => {
  const expected = {
    modules: 'webpack',
    framework: 'angular1',
    buildTask: `gulp.series('partials', gulp.parallel('other', 'webpack:dist'))`,
    serveTask: `gulp.series('webpack:watch', 'watch', 'browsersync')`,
    testTask: `gulp.series('karma:single-run')`,
    testAutoTask: `gulp.series('karma:auto-run')`
  };
  const result = gulpfileConf({modules: expected.modules, framework: expected.framework});
  t.deepEqual(result, expected);
});

test('gulpfileConf with react/inject', t => {
  const expected = {
    modules: 'inject',
    framework: 'react',
    buildTask: `gulp.series(gulp.parallel('inject', 'other'), 'build')`,
    serveTask: `gulp.series('inject', 'watch', 'browsersync')`,
    testTask: `gulp.series('scripts', 'karma:single-run')`,
    testAutoTask: `gulp.series('watch', 'karma:auto-run')`
  };
  const result = gulpfileConf({modules: expected.modules, framework: expected.framework});
  t.deepEqual(result, expected);
});

test('gulpfileConf with react/systemjs', t => {
  const expected = {
    modules: 'systemjs',
    framework: 'react',
    buildTask: `gulp.series(gulp.parallel('systemjs', 'systemjs:html', 'styles', 'other'), 'build')`,
    serveTask: `gulp.series(gulp.parallel('scripts', 'styles'), 'watch', 'browsersync')`,
    testTask: `gulp.series('karma:single-run')`,
    testAutoTask: `gulp.series('karma:auto-run')`
  };
  const result = gulpfileConf({modules: expected.modules, framework: expected.framework});
  t.deepEqual(result, expected);
});
