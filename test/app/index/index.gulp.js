const spies = require('chai-spies');
const chai = require('chai');
const expect = chai.expect;
chai.use(spies);
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  require('../../../generators/app/index');
});

test('Call this.fs.copyTpl', () => {
  context.templatePath = path => path;
  context.destinationPath = path => path;
  context.fs = {
    copyTpl: () => {}
  };
  const spy = chai.spy.on(context.fs, 'copyTpl');
  TestUtils.call(context, 'configuring.gulp');
  expect(spy).to.have.been.called.once();
});
