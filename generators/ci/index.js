'use strict';

const fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  writing() {
    if (this.options.ci.indexOf('jenkins') > -1) {
      this.fs.copy(
        this.templatePath('.dockerignore'),
        this.destinationPath('.dockerignore')
      );
      this.fs.copy(
        this.templatePath('Dockerfile'),
        this.destinationPath('Dockerfile')
      );
    }
    if (this.options.ci.indexOf('travis') > -1) {
      this.fs.copy(
        this.templatePath('.travis.yml'),
        this.destinationPath('.travis.yml')
      );
    }
    if (this.options.ci.indexOf('circleci') > -1) {
      this.fs.copy(
        this.templatePath('circle.yml'),
        this.destinationPath('circle.yml')
      );
    }
    if (this.options.ci.indexOf('wercker') > -1) {
      this.fs.copy(
        this.templatePath('wercker.yml'),
        this.destinationPath('wercker.yml')
      );
    }
  }
});
