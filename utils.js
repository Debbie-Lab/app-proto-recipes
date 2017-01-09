'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dirExists = dirExists;
exports.accessible = accessible;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dirExists(directory) {
  try {
    return _fs2.default.statSync(_path2.default.resolve(directory)).isDirectory();
  } catch (err) {
    return false;
  }
}

function accessible() {
  try {
    _fs2.default.accessSync.apply(_fs2.default, arguments);
    return true;
  } catch (e) {
    return false;
  }
}