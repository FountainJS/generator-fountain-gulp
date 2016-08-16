const test = require('ava');
const spies = require('chai-spies');
const chai = require('chai');
const expect = chai.expect;
chai.use(spies);
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('ci');
  context.templatePath = path => path;
  context.destinationPath = path => path;
  context.fs = {
    copy: () => {}
  };
  require('../../generators/ci/index');
});

test('Call this.fs.copy twice for Jenkins', () => {
  context.options.ci = ['jenkins'];
  const spy1 = chai.spy.on(context.fs, 'copy');
  TestUtils.call(context, 'writing');
  expect(spy1).to.have.been.called.twice();
});

test('Call this.fs.copy once for CircleCi', () => {
  context.options.ci = ['circleci'];
  const spy1 = chai.spy.on(context.fs, 'copy');
  TestUtils.call(context, 'writing');
  expect(spy1).to.have.been.called.once();
});

test('Call this.fs.copy once for Travis', () => {
  context.options.ci = ['travis'];
  const spy1 = chai.spy.on(context.fs, 'copy');
  TestUtils.call(context, 'writing');
  expect(spy1).to.have.been.called.once();
});

test('Call this.fs.copy once for Wercker', () => {
  context.options.ci = ['wercker'];
  const spy1 = chai.spy.on(context.fs, 'copy');
  TestUtils.call(context, 'writing');
  expect(spy1).to.have.been.called.once();
});
