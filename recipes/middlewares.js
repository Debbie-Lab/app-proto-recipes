'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middlewaresRecipe;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var join = _path2.default.join;

function middlewaresRecipe(app, mrPath) {

  if (!(0, _utils.dirExists)(mrPath)) {
    throw new Error('Wrong path: ' + mrPath);
  }

  var middlewares = [];
  (0, _glob2.default)(join('*.js'), { cwd: mrPath, dot: false, sync: true }).filter(function (file) {
    return !file.startsWith('$');
  }).map(function (file) {
    return middlewares[file.replace('.js', '')] = require(join(mrPath, file)).default;
  });

  app.context['$middlewares'] = middlewares;

  console.log(join(mrPath, '$global.js'));
  var globMiddlewares = require(join(mrPath, '$global.js')).default;

  console.log(globMiddlewares);
  if (!Array.isArray(globMiddlewares)) {
    throw new Error('$global.js error');
  }

  var availableMiddlewares = [];
  globMiddlewares.forEach(function (middleware) {
    if (middleware in middlewares) {
      availableMiddlewares.push(middlewares[middleware]);
    } else {
      throw new Error('middlewares \'' + middleware + '\' NOT FOUND!');
    }
  });
  app.use((0, _koaCompose2.default)(availableMiddlewares));
}