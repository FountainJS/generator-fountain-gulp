const fountain = require('fountain-generator');
const conf = require('./conf');

module.exports = fountain.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'del': '^2.2.2',
          'gulp': 'gulpjs/gulp#4ed9a4a3275559c73a396eff7e1fde3824951ebb',
          'gulp-hub': 'frankwallis/gulp-hub#d461b9c700df9010d0a8694e4af1fb96d9f38bf4',
          'gulp-filter': '^5.0.0',
          'gulp-util': '^3.0.8'
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
          'gulp-useref': '^3.1.2',
          'lazypipe': '^1.0.1',
          'gulp-postcss': '^6.3.0',
          'autoprefixer': '^6.7.3',
          'gulp-rev': '^7.1.2',
          'gulp-rev-replace': '^0.4.3',
          'gulp-sourcemaps': '^2.4.1',
          'gulp-uglify': '^2.0.1',
          'uglify-save-license': '^0.4.1',
          'gulp-cssnano': '^2.1.2',
          'gulp-htmlmin': '^3.0.0'
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
          'gulp-htmlmin': '^3.0.0',
          'gulp-insert': '^0.5.0',
          'gulp-ng-annotate': '^2.0.0'
        });
        if (this.options.modules !== 'webpack') {
          Object.assign(pkg.devDependencies, {
            'gulp-angular-templatecache': '^2.0.0'
          });
        }
      }

      if (this.options.framework === 'angular2' && this.options.modules === 'systemjs') {
        Object.assign(pkg.devDependencies, {
          'gulp-inline-ng2-template': '^4.0.0'
        });
      }

      if (this.options.css === 'scss') {
        Object.assign(pkg.devDependencies, {
          'gulp-sass': '^3.1.0'
        });
      }

      if (this.options.css === 'less') {
        Object.assign(pkg.devDependencies, {
          'gulp-less': '^3.3.0'
        });
      }

      if (this.options.css === 'styl') {
        Object.assign(pkg.devDependencies, {
          'gulp-stylus': '^2.6.0'
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
    this.composeWith(require.resolve(`../git`), {modules: this.options.modules});

    this.composeWith(require.resolve(`../ci`), {ci: this.options.ci});

    this.composeWith(require.resolve(`../insight`), this.options);

    this.composeWith(require.resolve('generator-fountain-browsersync/generators/app'), this.options);

    this.composeWith(require.resolve('generator-fountain-karma/generators/app'), this.options);

    this.composeWith(require.resolve(`generator-fountain-${this.options.modules}/generators/app`), this.options);

    this.composeWith(require.resolve('generator-fountain-eslint/generators/app'), this.options);
    if (this.options.js === 'typescript') {
      this.composeWith(require.resolve('generator-fountain-tslint/generators/app'), this.options);
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
    if (this.options.framework === 'vue') {
      ignored.push('vue');
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
