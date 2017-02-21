const path = require('path');
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  require('../../../generators/app/index');
  process.chdir(path.resolve(__dirname, '../../../'));
});

test.beforeEach(() => {
  context.copyTemplate['gulpfile.js'] = null;
  context.copyTemplate['gulp_tasks/build.js'] = null;
  context.copyTemplate['gulp_tasks/styles.js'] = null;
  context.copyTemplate['gulp_tasks/misc.js'] = null;
  context.copyTemplate['gulp_tasks/partials.js'] = null;
});

test('Copy misc.js and gulpfile.js', t => {
  TestUtils.call(context, 'writing', {framework: 'react', modules: 'webpack'});
  t.true(context.copyTemplate['gulp_tasks/misc.js'].length > 0);
  t.true(context.copyTemplate['gulpfile.js'].length > 0);
});

test('Copy misc.js, gulpfile.js, styles.js and build.js', t => {
  const extensions = {js: 'js', css: 'css'};
  TestUtils.call(context, 'writing', {framework: 'react', modules: 'systemjs', extensions});
  t.true(context.copyTemplate['gulp_tasks/misc.js'].length > 0);
  t.true(context.copyTemplate['gulpfile.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/build.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/styles.js'].length > 0);
});

test('Copy misc.js and gulpfile.js', t => {
  const extensions = {js: 'js', css: 'css'};
  TestUtils.call(context, 'writing', {framework: 'vue', modules: 'webpack', extensions});
  t.true(context.copyTemplate['gulp_tasks/misc.js'].length > 0);
  t.true(context.copyTemplate['gulpfile.js'].length > 0);
  t.is(context.copyTemplate['gulp_tasks/partials.js'], null);
});

test('Copy misc.js, gulpfile.js and partials.js', t => {
  const extensions = {js: 'js', css: 'css'};
  TestUtils.call(context, 'writing', {framework: 'angular1', modules: 'systemjs', extensions});
  t.true(context.copyTemplate['gulp_tasks/misc.js'].length > 0);
  t.true(context.copyTemplate['gulpfile.js'].length > 0);
  t.true(context.copyTemplate['gulp_tasks/partials.js'].length > 0);
});
