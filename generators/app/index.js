const fountain = require('fountain-generator');
const conf = require('./conf');

module.exports = fountain.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'del': '^2.0.2',
          'gulp': 'gulpjs/gulp#4ed9a4a3275559c73a396eff7e1fde3824951ebb',
          'gulp-hub': 'frankwallis/gulp-hub#d461b9c700df9010d0a8694e4af1fb96d9f38bf4',
          'gulp-filter': '^4.0.0',
          'gulp-util': '^3.0.7'
        },
        scripts: {
          'build': 'gulp',
          'serve': 'gulp serve',
          'serve:dist': 'gulp serve:dist',
          'test': 'gulp test',
          'test:auto': 'gulp test:auto'
        }
      };

      if (this.options.modules !== 'webpack') {
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
          'gulp-htmlmin': '^1.3.0'
        });
      }

      if (this.options.modules === 'systemjs') {
        Object.assign(pkg.devDependencies, {
          'gulp-rename': '^1.2.2'
        });
      }

      if (this.options.framework === 'angular1') {
        Object.assign(pkg.devDependencies, {
          'gulp-angular-filesort': '^1.1.1',
          'gulp-htmlmin': '^1.3.0',
          'gulp-insert': '^0.5.0',
          'gulp-ng-annotate': '^1.1.0'
        });
        if (this.options.modules !== 'webpack') {
          Object.assign(pkg.devDependencies, {
            'gulp-angular-templatecache': '^1.8.0'
          });
        }
      }

      if (this.options.framework === 'angular2' && this.options.modules === 'systemjs') {
        Object.assign(pkg.devDependencies, {
          'gulp-inline-ng2-template': '^2.0.4'
        });
      }

      if (this.options.css === 'scss') {
        Object.assign(pkg.devDependencies, {
          'gulp-sass': '^2.1.1'
        });
      }

      if (this.options.css === 'less') {
        Object.assign(pkg.devDependencies, {
          'gulp-less': '^3.0.5'
        });
      }

      if (this.options.css === 'styl') {
        Object.assign(pkg.devDependencies, {
          'gulp-stylus': '^2.4.0'
        });
      }

      this.mergeJson('package.json', pkg);
    },

    gulp() {
      this.fs.copyTpl(
        this.templatePath('conf'),
        this.destinationPath('conf'),
        this.options
      );
    },

    babel() {
      if (this.options.js === 'babel') {
        this.mergeJson('.babelrc', {
          presets: ['es2015'],
          env: {
            test: {
              plugins: ['istanbul']
            }
          }
        });

        if (this.options.modules === 'webpack' && this.options.framework !== 'angular1' && this.options.framework !== 'angular2') {
          this.mergeJson('.babelrc', {
            env: {
              production: {
                presets: [
                  ['es2015', {modules: false}]
                ]
              }
            }
          });
        }
      }
    }
  },

  composing() {
    this.composeWith(`fountain-gulp:git`, {options: {modules: this.options.modules}}, {
      local: require.resolve(`../git`)
    });
    this.composeWith(`fountain-gulp:ci`, {options: {ci: this.options.ci}}, {
      local: require.resolve(`../ci`)
    });
    this.composeWith(`fountain-gulp:insight`, {options: this.options}, {
      local: require.resolve(`../insight`)
    });
    this.composeWith('fountain-browsersync', {options: this.options}, {
      local: require.resolve('generator-fountain-browsersync/generators/app')
    });
    this.composeWith('fountain-karma', {options: this.options}, {
      local: require.resolve('generator-fountain-karma/generators/app')
    });
    this.composeWith(`fountain-${this.options.modules}`, {options: this.options}, {
      local: require.resolve(`generator-fountain-${this.options.modules}/generators/app`)
    });
    this.composeWith('fountain-eslint', {options: this.options}, {
      local: require.resolve('generator-fountain-eslint/generators/app')
    });
    if (this.options.js === 'typescript') {
      this.composeWith('fountain-tslint', {options: this.options}, {
        local: require.resolve('generator-fountain-tslint/generators/app')
      });
    }
  },

  writing() {
    this.copyTemplate(
      'gulpfile.js',
      'gulpfile.js',
      conf(this.options)
    );

    if (this.options.modules !== 'webpack') {
      this.copyTemplate(
        'gulp_tasks/build.js',
        'gulp_tasks/build.js',
        this.options
      );

      this.copyTemplate(
        'gulp_tasks/styles.js',
        'gulp_tasks/styles.js',
        this.options
      );
    }
    const extensions = this.getExtensions(this.options);
    const ignored = [this.options.css, extensions.js];
    if (this.options.framework !== 'react') {
      ignored.push('html');
    }

    this.copyTemplate(
      'gulp_tasks/misc.js',
      'gulp_tasks/misc.js',
      Object.assign({}, this.options, {ignored: ignored.join(',')})
    );

    if (this.options.framework === 'angular1' && this.options.modules !== 'webpack') {
      this.copyTemplate(
        'gulp_tasks/partials.js',
        'gulp_tasks/partials.js',
        this.options
      );
    }
  },

  install() {
    this.npmInstall();
  }
});
