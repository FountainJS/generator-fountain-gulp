const _ = require('lodash');
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;
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

test.before(() => {
  context = TestUtils.mock('app');
  require('../../../generators/app/index');
});

test.beforeEach(() => {
  context.mergeJson['package.json'] = {};
});

test('Configuring package.json with angular1/systemjs/css', t => {
  const expected = _.mergeWith({}, pkg, {
    devDependencies: {
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
      'gulp-htmlmin': '^3.0.0',
      'gulp-rename': '^1.2.2',
      'gulp-angular-filesort': '^1.1.1',
      'gulp-angular-templatecache': '^2.0.0',
      'gulp-insert': '^0.5.0',
      'gulp-ng-annotate': '^2.0.0'
    }
  });
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular1', modules: 'systemjs', css: 'css'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular1/webpack/css', t => {
  const expected = _.mergeWith({}, pkg, {
    devDependencies: {
      'gulp-angular-filesort': '^1.1.1',
      'gulp-htmlmin': '^3.0.0',
      'gulp-insert': '^0.5.0',
      'gulp-ng-annotate': '^2.0.0'
    }
  });
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular1', modules: 'webpack', css: 'css'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/webpack/scss', t => {
  const expected = _.mergeWith({}, pkg, {
    devDependencies: {'gulp-sass': '^3.1.0'}
  });
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular2', modules: 'webpack', css: 'scss'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/systemjs/scss', t => {
  const expected = _.mergeWith({}, pkg, {
    devDependencies: {
      'gulp-sass': '^3.1.0',
      'gulp-inline-ng2-template': '^4.0.0',
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
      'gulp-htmlmin': '^3.0.0',
      'gulp-rename': '^1.2.2'
    }
  });
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular2', modules: 'systemjs', css: 'scss'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/webpack/less', t => {
  const expected = _.mergeWith({}, pkg, {
    devDependencies: {'gulp-less': '^3.3.0'}
  });
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular2', modules: 'webpack', css: 'less'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/webpack/styl', t => {
  const expected = _.mergeWith({}, pkg, {
    devDependencies: {'gulp-stylus': '^2.6.0'}
  });
  TestUtils.call(context, 'configuring.pkg', {framework: 'angular2', modules: 'webpack', css: 'styl'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});
