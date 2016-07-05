'use strict';

const fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  writing() {
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );

    this.copyTemplate(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
  },

  end() {
    this.spawnCommandSync('git', ['init']);
  }
});
