const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  context.composeWith = () => {};
  require('../../../generators/app/index');
});

test('Call this.composeWith 6 times', () => {
  const spy = chai.spy.on(context, 'composeWith');
  TestUtils.call(context, 'composing', {js: 'babel'});
  expect(spy).to.have.been.called.exactly(6);
});

test('Call this.composeWith 7 times', () => {
  const spy = chai.spy.on(context, 'composeWith');
  TestUtils.call(context, 'composing', {js: 'typescript'});
  expect(spy).to.have.been.called.exactly(7);
});
