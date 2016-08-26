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

test(`Configure .babelrc when js is 'babel' and modules is 'webpack'`, t => {
  const expected = {
    env: {
      development: {presets: ['es2015']},
      production: {presets: [['es2015', {modules: false}]]}
    }
  };
  TestUtils.call(context, 'configuring.babel', {js: 'babel', modules: 'webpack'});
  t.deepEqual(context.mergeJson['.babelrc'], expected);
});

test(`Configure .babelrc when js is 'babel' and modules is 'systemjs'`, t => {
  const expected = {presets: ['es2015']};
  TestUtils.call(context, 'configuring.babel', {js: 'babel', modules: 'systemjs'});
  t.deepEqual(context.mergeJson['.babelrc'], expected);
});

test(`Configure .babelrc when js is 'js'`, t => {
  TestUtils.call(context, 'configuring.babel', {js: 'js'});
  t.deepEqual(context.mergeJson['.babelrc'], {});
});
