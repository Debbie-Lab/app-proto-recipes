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

  var assign = function assign(name, mw) {
    if (typeof middlewares[name] !== 'undefined') {
      new Error('Middleware is re-registered: ' + name);
    } else {
      middlewares[name] = mw;
    }
  };

  var pkgPath = join(mrPath, '$pkges.js');
  if ((0, _utils.accessible)(pkgPath)) {
    var pkges = require(pkgPath).default;
    if (!Array.isArray(pkges)) {
      throw new Error('"' + pkgPath + '" error: must array');
    }
    pkges.forEach(function (pkg) {
      return assign(pkg, require(pkg).default);
    });
  }

  (0, _glob2.default)(join('**/*.js'), { cwd: mrPath, dot: false, sync: true }).filter(function (file) {
    return !file.startsWith('$');
  }).map(function (file) {
    return assign(file.replace('.js', ''), require(join(mrPath, file)).default);
  });

  app.context['$middlewares'] = middlewares;

  var globMiddlewares = require(join(mrPath, '$global.js')).default;

  if (!Array.isArray(globMiddlewares)) {
    throw new Error('"$global.js" error: must array');
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