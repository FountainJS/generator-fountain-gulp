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

test('Call this.fs.copy twice', () => {
  context.templatePath = path => path;
  context.destinationPath = path => path;
  context.fs = {
    copy: () => {}
  };
  const spy = chai.spy.on(context.fs, 'copy');
  TestUtils.call(context, 'writing');
  expect(spy).to.have.been.called.twice();
});

test('Call this.spawnCommandSync', () => {
  context.spawnCommandSync = () => {};
  const spy = chai.spy.on(context, 'spawnCommandSync');
  TestUtils.call(context, 'end');
  expect(spy).to.have.been.called.once();
});
