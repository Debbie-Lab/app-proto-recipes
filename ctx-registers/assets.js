"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const prod = process.env.NODE_ENV === 'production';
const root = process.cwd();

const ASSETS_DEPS_JSON = _path.default.resolve(root, '__deps__.json');

class Assets {
  constructor() {
    this.cache = require(ASSETS_DEPS_JSON);
  }

  deps(key, type) {
    const suffix = type || 'js';

    if (!this.cache[key] || !this.cache[key][suffix]) {
      throw new ReferenceError(`["${key}"]["${suffix}"] is not in assets object.`);
    }

    return this.cache[key][suffix];
  }

}

exports.default = Assets;