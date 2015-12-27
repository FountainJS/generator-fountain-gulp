const _ = require('lodash');
const fountain = require('fountain-generator');
const conf = require('./conf');

module.exports = fountain.Base.extend({
  prompting: function () {
    this.fountainPrompting();
  },

  configuring: {
    package: function () {
      var pkg = {
        devDependencies: {
          'babel-core': '^6.2.0',
          'babel-preset-es2015': '^6.1.18',
          del: '^2.0.2',
          gulp: 'gulpjs/gulp#4.0',
          'gulp-autoprefixer': '^3.1.0',
          'gulp-filter': '^3.0.1',
          'gulp-flatten': '^0.2.0',
          'gulp-hub': 'frankwallis/gulp-hub#registry-init',
          'gulp-minify-css': '^1.2.1',
          'gulp-minify-html': '^1.0.4',
          'gulp-replace': '^0.5.4',
          'gulp-rev': '^6.0.1',
          'gulp-rev-replace': '^0.4.2',
          'gulp-sourcemaps': '^1.6.0',
          'gulp-uglify': '^1.4.2',
          'gulp-useref': '^3.0.3',
          'gulp-util': '^3.0.7',
          'uglify-save-license': '^0.4.1'
        },
        scripts: {
          build: 'gulp',
          serve: 'gulp serve'
        }
      };

      if (this.props.framework === 'angular1') {
        _.merge(pkg, {
          devDependencies: {
            'gulp-angular-filesort': '^1.1.1',
            'gulp-angular-templatecache': '^1.8.0',
            'gulp-ng-annotate': '^1.1.0',
            'gulp-insert': '^0.5.0'
          }
        });
      }

      if (this.props.css === 'scss') {
        _.merge(pkg, {
          devDependencies: {
            'gulp-sass': '^2.0.4'
          }
        });
      }

      this.mergeJson('package.json', pkg);
    },

    gulp: function () {
      this.fs.copyTpl(
        this.templatePath('conf'),
        this.destinationPath('conf'),
        this.props
      );
    },

    babel: function () {
      this.mergeJson('.babelrc', { presets: ['es2015'] });
    }
  },

  composing: function () {
    this.composeWith('fountain-browsersync', { options: this.props }, {
      local: require.resolve('generator-fountain-browsersync/generators/app')
    });
    this.composeWith('fountain-karma', { options: this.props }, {
      local: require.resolve('generator-fountain-karma/generators/app')
    });
    this.composeWith(`fountain-${this.props.modules}`, { options: this.props }, {
      local: require.resolve(`generator-fountain-${this.props.modules}/generators/app`)
    });
    this.composeWith('fountain-eslint', { options: this.props }, {
      local: require.resolve('generator-fountain-eslint/generators/app')
    });
  },

  writing: function () {
    this.copyTemplate(
      'gulpfile.js',
      'gulpfile.js',
      conf(this.props)
    );

    if (this.props.modules !== 'webpack') {
      this.copyTemplate(
        'gulp_tasks/build.js',
        'gulp_tasks/build.js',
        this.props
      );

      this.copyTemplate(
        'gulp_tasks/styles.js',
        'gulp_tasks/styles.js',
        this.props
      );
    }

    this.copyTemplate(
      'gulp_tasks/misc.js',
      'gulp_tasks/misc.js',
      this.props
    );

    if (this.props.framework === 'angular1') {
      this.copyTemplate(
        'gulp_tasks/partials.js',
        'gulp_tasks/partials.js',
        this.props
      );
    }
  },

  installing: function () {
    this.npmInstall();
  }
});
