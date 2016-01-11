const fountain = require('fountain-generator');
const conf = require('./conf');

module.exports = fountain.Base.extend({
  prompting() {
    this.fountainPrompting();
  },

  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'del': '^2.0.2',
          'gulp': 'gulpjs/gulp#4.0',
          'gulp-hub': 'frankwallis/gulp-hub#registry-init',
          'gulp-filter': '^3.0.1'
        },
        scripts: {
          build: 'gulp',
          serve: 'gulp serve'
        }
      };

      if (this.props.modules !== 'webpack') {
        Object.assign(pkg.devDependencies, {
          'gulp-useref': '^3.0.3',
          'gulp-postcss': '^6.0.1',
          'autoprefixer': '^6.2.3',
          'gulp-rev': '^6.0.1',
          'gulp-rev-replace': '^0.4.2',
          'gulp-sourcemaps': '^1.6.0',
          'gulp-uglify': '^1.4.2',
          'uglify-save-license': '^0.4.1',
          'gulp-cssnano': '^2.1.0',
          'gulp-htmlmin': '^1.3.0',
          'gulp-util': '^3.0.7'
        });
      }

      if (this.props.framework === 'angular1') {
        Object.assign(pkg.devDependencies, {
          'gulp-angular-filesort': '^1.1.1',
          'gulp-angular-templatecache': '^1.8.0',
          'gulp-ng-annotate': '^1.1.0',
          'gulp-insert': '^0.5.0'
        });
      }

      if (this.props.css === 'scss') {
        Object.assign(pkg.devDependencies, {
          'gulp-sass': '^2.1.1'
        });
      }

      if (this.props.css === 'less') {
        Object.assign(pkg.devDependencies, {
          'gulp-less': '^3.0.5'
        });
      }

      if (this.props.js === 'babel' || this.props.js === 'js' && this.props.framework === 'react') {
        Object.assign(pkg.devDependencies, {
          'babel-core': '^6.2.0'
        });
      }

      if (this.props.js === 'babel') {
        Object.assign(pkg.devDependencies, {
          'babel-preset-es2015': '^6.2.0'
        });
      }

      this.mergeJson('package.json', pkg);
    },

    gulp() {
      this.fs.copyTpl(
        this.templatePath('conf'),
        this.destinationPath('conf'),
        this.props
      );
    },

    babel() {
      this.mergeJson('.babelrc', { presets: ['es2015'] });
    }
  },

  composing() {
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
    if (this.props.js === 'typescript') {
      this.composeWith('fountain-tslint', { options: this.props }, {
        local: require.resolve('generator-fountain-tslint/generators/app')
      });
    }
  },

  writing() {
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

  installing() {
    this.npmInstall();
  }
});
