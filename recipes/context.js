'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contextRecipe;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var join = _path2.default.join;

/**
 * @param {object} app (a koa app instance).
 * @param {string} crPath
 **/
function contextRecipe(app, crPath) {

  if (!(0, _utils.dirExists)(crPath)) {
    throw new Error('Wrong path: ' + crPath);
  }

  (0, _glob2.default)(join('*.js'), { cwd: crPath, dot: false, sync: true }).map(function (file) {
    var Ctx = require(join(crPath, file)).default;
    var ctxName = file.replace(/\.\w+$/, '');
    var ctxObj = new Ctx();

    if (app.context[ctxName]) {
      throw new Error('Duplicate objects: ' + ctxName);
    }

    app.context[ctxName] = ctxObj;
  });
}