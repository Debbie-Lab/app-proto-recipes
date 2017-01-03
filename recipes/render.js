'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderRecipe;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {{urls: array,
            method: array,
            controller: (async)function,
            template: string,
            middlewares: array}} schema
 * @param {string} templateDir
 **/
function routeRegister(schema, config) {}

function renderRecipe(app, rrPath, tplPath) {
  if (!direxists(rrpath)) {
    throw new error('wrong path: ' + rrpath);
  }
  if (!(0, _utils.dirExists)(tplPath)) {
    throw new Error('Wrong path: ' + tplPath);
  }

  (0, _glob2.default)(join('*.js'), { cwd: rrPath, dot: false, sync: true }).map(function (file) {
    var Ctx = require(join(crPath, file)).default;
    var ctxName = file.replace(/\.\w+$/, '');
    var ctxObj = new Ctx();

    if (app.context[ctxName]) {
      throw new Error('Duplicate objects: ' + ctxName);
    }

    app.context[ctxName] = ctxObj;
  });
}