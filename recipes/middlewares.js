"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middlewaresRecipe;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const join = _path.default.join;

function middlewaresRecipe(app, mrPath) {
  if (!(0, _utils.dirExists)(mrPath)) {
    throw new Error(`Wrong path: ${mrPath}`);
  }

  const middlewares = {};

  const assign = (name, mw) => {
    if (typeof middlewares[name] !== 'undefined') {
      new Error(`Middleware is re-registered: ${name}`);
    } else {
      middlewares[name] = mw;
    }
  };

  const pkgPath = join(mrPath, '$pkges.js');

  if ((0, _utils.accessible)(pkgPath)) {
    const pkgs = require(pkgPath).default;

    if ((0, _utils.getDataType)(pkgs) !== 'Object') {
      throw new Error(`"${pkgPath}" error: must object`);
    }

    Object.keys(pkgs).forEach(key => assign(key, require(pkgs[key]).default));
  }

  (0, _glob.default)(join('**/*.js'), {
    cwd: mrPath,
    dot: false,
    sync: true
  }).filter(file => !file.startsWith('$')).map(file => assign(file.replace('.js', ''), require(join(mrPath, file)).default));
  app.context['$middlewares'] = middlewares;

  const globMiddlewares = require(join(mrPath, '$global.js')).default;

  if (!Array.isArray(globMiddlewares)) {
    throw new Error('"$global.js" error: must array');
  }

  const availableMiddlewares = [];
  globMiddlewares.forEach(middleware => {
    if (middleware in middlewares) {
      availableMiddlewares.push(middlewares[middleware]);
    } else {
      throw new Error(`middlewares '${middleware}' NOT FOUND!`);
    }
  });
  app.use((0, _koaCompose.default)(availableMiddlewares));
}