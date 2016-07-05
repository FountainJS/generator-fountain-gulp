const spies = require('chai-spies');
const chai = require('chai');
const expect = chai.expect;
chai.use(spies);
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('git');
  require('../../generators/git/index');
});

test('Call this.fs.copy and this.copyTemplate', () => {
  context.templatePath = path => path;
  context.destinationPath = path => path;
  context.copyTemplate = () => {};
  context.fs = {
    copy: () => {}
  };
  const spy1 = chai.spy.on(context.fs, 'copy');
  const spy2 = chai.spy.on(context, 'copyTemplate');
  TestUtils.call(context, 'writing');
  expect(spy1).to.have.been.called.once();
  expect(spy2).to.have.been.called.once();
});

test('Call this.spawnCommandSync', () => {
  context.spawnCommandSync = () => {};
  const spy = chai.spy.on(context, 'spawnCommandSync');
  TestUtils.call(context, 'end');
  expect(spy).to.have.been.called.once();
});
