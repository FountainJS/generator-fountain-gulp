/* eslint no-unused-expressions: 0 */

const expect = require('chai').expect;
const TestUtils = require('fountain-generator').TestUtils;

describe('generator fountain gulp partials', () => {
  beforeEach(function () {
    this.context = TestUtils.mock();
    require('../generators/app/index');
  });

  it('should prepend template cache with with angular module loading', function () {
    const getFile = () => this.context.copyTemplate['gulp_tasks/partials.js'];
    TestUtils.call(this.context, 'writing', { framework: 'angular1' });
    expect(getFile()).to.match(/insert\.prepend.*require\('angular'\)/);
  });
});
