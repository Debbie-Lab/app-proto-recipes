"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataType = getDataType;
exports.dirExists = dirExists;
exports.accessible = accessible;
exports.getDirObjs = getDirObjs;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const join = _path.default.join;

function getDataType(obj) {
  if (obj instanceof Array) return 'Array';
  if (obj instanceof Object) return 'Object';
  return null;
}

function dirExists(directory) {
  try {
    return _fs.default.statSync(_path.default.resolve(directory)).isDirectory();
  } catch (err) {
    return false;
  }
}

function accessible() {
  try {
    _fs.default.accessSync.apply(_fs.default, arguments);

    return true;
  } catch (e) {
    return false;
  }
}

function getDirObjs(dir, whitelist = []) {
  if (!dirExists(dir)) {
    throw new Error(`Wrong path: ${dir}`);
  }

  const whiteset = new Set(whitelist);
  const objs = {};
  (0, _glob.default)(join('**/*.js'), {
    cwd: dir,
    dot: false,
    sync: true
  }).filter(file => !whiteset.has(file)).forEach(file => objs[file.replace(/\.\w+$/, '')] = require(join(dir, file)).default);
  return objs;
}