/* eslint prefer-spread: 0 */
'use strict';

const _ = require('lodash');

function series() {
  const array = [];
  array.push.apply(array, arguments);
  array.type = 'series';
  return array;
}

function parallel() {
  const array = [];
  array.push.apply(array, arguments);
  array.type = 'parallel';
  return array;
}

function gulpTasksToString(tasks) {
  let result;
  if (_.isArray(tasks)) {
    result = `gulp.${tasks.type}(${tasks.map(gulpTasksToString).join(', ')})`;
  } else {
    result = `'${tasks}'`;
  }
  return result;
}

module.exports = function gulpfileConf(generatorOptions) {
  const options = Object.assign({}, generatorOptions);

  if (options.modules === 'webpack') {
    options.buildTask = series(parallel('other', 'webpack:dist'));
  } else if (options.modules === 'inject') {
    options.buildTask = series(parallel('inject', 'other'), 'build');
  } else {
    options.buildTask = series(parallel('systemjs', 'systemjs:html', 'styles', 'other'), 'build');
  }

  if (options.framework === 'angular1') {
    options.buildTask.unshift('partials');
  }

  if (options.modules === 'inject') {
    options.serveTask = series('clean', 'inject', 'watch', 'browsersync');
  } else if (options.modules === 'webpack') {
    options.serveTask = series('clean', 'webpack:watch', 'watch', 'browsersync');
  } else {
    options.serveTask = series('clean', parallel('scripts', 'styles'), 'watch', 'browsersync');
  }

  if (options.modules === 'inject') {
    options.testTask = series('scripts', 'karma:single-run');
    options.testAutoTask = series('watch', 'karma:auto-run');
  } else {
    options.testTask = series('karma:single-run');
    options.testAutoTask = series('karma:auto-run');
  }

  ['buildTask', 'serveTask', 'testTask', 'testAutoTask'].forEach(task => {
    options[task] = gulpTasksToString(options[task]);
  });

  return options;
};
