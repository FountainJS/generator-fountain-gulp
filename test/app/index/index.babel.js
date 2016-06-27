const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  require('../../../generators/app/index');
});

test.beforeEach(() => {
  context.mergeJson['.babelrc'] = {};
});

test(`Configure .babelrc when js is 'babel'`, t => {
  TestUtils.call(context, 'configuring.babel', {js: 'babel'});
  t.deepEqual(context.mergeJson['.babelrc'], {presets: ['es2015']});
});

test(`Configure .babelrc when js is 'js'`, t => {
  TestUtils.call(context, 'configuring.babel', {js: 'js'});
  t.deepEqual(context.mergeJson['.babelrc'], {});
});
