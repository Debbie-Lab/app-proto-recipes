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

function contextRecipe(app, crPath) {

  if (!(0, _utils.dirExists)(crPath)) {
    throw new Error('Wrong path: ' + crPath);
  }

  var pkgPath = join(crPath, '$pkges.js');
  if ((0, _utils.accessible)(pkgPath)) {
    var pkges = require(pkgPath).default;
    if ((0, _utils.getDataType)(pkges) !== 'Object') {
      throw new Error('"' + pkgPath + '" error: must a object.');
    }

    Object.keys(pkges).forEach(function (key) {
      var Ctx = require(pkges[key]).default;
      if (app.context[key]) {
        throw new Error('Duplicate objects: ' + pkg + '; see file \'' + pkgPath + '\'');
      }
      app.context[key] = new Ctx();
    });
  }

  (0, _glob2.default)(join('**/*.js'), { cwd: crPath, dot: false, sync: true }).filter(function (file) {
    return !file.startsWith('$');
  }).map(function (file) {
    var Ctx = require(join(crPath, file)).default;
    var ctxName = file.replace(/\.\w+$/, '');
    var ctxObj = new Ctx();

    if (app.context[ctxName]) {
      throw new Error('Duplicate objects: ' + ctxName + '; see file \'' + file + '\'');
    }

    app.context[ctxName] = ctxObj;
  });
}