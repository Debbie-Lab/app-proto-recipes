"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contextRecipe;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const join = _path.default.join;

function contextRecipe(app, crPath) {
  if (!(0, _utils.dirExists)(crPath)) {
    throw new Error(`Wrong path: ${crPath}`);
  }

  const pkgPath = join(crPath, '$pkges.js');

  if ((0, _utils.accessible)(pkgPath)) {
    const pkges = require(pkgPath).default;

    if ((0, _utils.getDataType)(pkges) !== 'Object') {
      throw new Error(`"${pkgPath}" error: must a object.`);
    }

    Object.keys(pkges).forEach(key => {
      const Ctx = require(pkges[key]).default;

      if (app.context[key]) {
        throw new Error(`Duplicate objects: ${pkg}; see file '${pkgPath}'`);
      }

      app.context[key] = new Ctx();
    });
  }

  (0, _glob.default)(join('**/*.js'), {
    cwd: crPath,
    dot: false,
    sync: true
  }).filter(file => !file.startsWith('$')).map(file => {
    const Ctx = require(join(crPath, file)).default;

    const ctxName = file.replace(/\.\w+$/, '');
    const ctxObj = new Ctx();

    if (app.context[ctxName]) {
      throw new Error(`Duplicate objects: ${ctxName}; see file '${file}'`);
    }

    app.context[ctxName] = ctxObj;
  });
}