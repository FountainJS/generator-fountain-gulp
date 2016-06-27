const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
const should = chai.should(); // eslint-disable-line no-unused-vars
chai.use(spies);
const Insight = require('insight');
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  context.composeWith = () => {};
  require('../../generators/insight/index');
});

test('Run Insight when optOut is true', async () => {
  const mockInsight = new Insight({
    trackingCode: 'UA-77742614-1',
    pkg: {
      name: 'fountainjs.io'
    }
  });
  mockInsight.optOut = true;
  context.async = () => {};
  const spy1 = chai.spy.on(Insight.prototype, 'track');
  const spy2 = chai.spy.on(Insight.prototype, 'askPermission');
  TestUtils.call(context, 'initializing', {js: 'babel'});
  spy1.should.have.not.been.called();
  spy2.should.have.not.been.called();
});

test('Run Insight when optOut is undefined', async () => {
  const mockInsight = new Insight({
    trackingCode: 'UA-77742614-1',
    pkg: {
      name: 'fountainjs.io'
    }
  });
  mockInsight.optOut = undefined;
  Insight.prototype.askPermission = () => {};
  context.async = () => {};
  const spy1 = chai.spy.on(Insight.prototype, 'track');
  const spy2 = chai.spy.on(Insight.prototype, 'askPermission');
  TestUtils.call(context, 'initializing', {js: 'babel'});
  expect(spy1).to.have.been.called.with('downloaded');
  expect(spy2).to.have.been.called.with(null);
});

test('Call end', () => {
  context.insight = {
    track: () => {}
  };
  const spy = chai.spy.on(context.insight, 'track');
  TestUtils.call(context, 'end');
  expect(spy).to.have.been.called.exactly(6);
});
