'use strict';

const fountain = require('fountain-generator');
const Insight = require('insight');
const _ = require('lodash');

module.exports = fountain.Base.extend({
  initializing() {
    this.insight = new Insight({
      trackingCode: 'UA-77742614-1',
      pkg: {
        name: 'fountainjs.io',
        version: require('../../package.json').version
      }
    });

    if (this.insight.optOut === undefined) {
      const done = this.async();

      this.insight.track('downloaded');

      this.insight.askPermission(null, done);
    }
  },

  end() {
    const optionsSelected = {
      framework: this.options.framework,
      modules: this.options.modules,
      js: this.options.js,
      css: this.options.css,
      sample: this.options.sample
    };

    _.forEach(optionsSelected, (value, key) => {
      this.insight.track(key, value);
    });
    this.insight.track.apply(this.insight, _.values(optionsSelected)); // eslint-disable-line prefer-spread
  }
});
