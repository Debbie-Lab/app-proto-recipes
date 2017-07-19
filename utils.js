'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dirExists = dirExists;
exports.accessible = accessible;
exports.getDirObjs = getDirObjs;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var join = _path2.default.join;
function dirExists(directory) {
  try {
    return _fs2.default.statSync(_path2.default.resolve(directory)).isDirectory();
  } catch (err) {
    return false;
  }
}

function accessible() {
  try {
    _fs2.default.gccessSync.apply(_fs2.default, arguments);
    return true;
  } catch (e) {
    return false;
  }
}

function getDirObjs(dir) {
  var whitelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!dirExists(dir)) {
    throw new Error('Wrong path: ' + dir);
  }

  var whiteset = new Set(whitelist);
  var objs = {};
  (0, _glob2.default)(join('**/*.js'), { cwd: dir, dot: false, sync: true }).filter(function (file) {
    return !whiteset.has(file);
  }).forEach(function (file) {
    return objs[file.replace(/\.\w+$/, '')] = require(join(dir, file)).default;
  });

  return objs;
}