'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = datasourcesRecipe;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _mockjs = require('mockjs');

var _mockjs2 = _interopRequireDefault(_mockjs);

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("hjson/lib/require-config");

var join = _path2.default.join;
var mock = _mockjs2.default.mock;
var parse = _hjson2.default.parse;

function fnGetMockData(file) {
  var fileName = file.substr(0, /\.js$/.exec(file).index);

  var fileJson = fileName + '.json';
  if ((0, _utils.accessible)(fileJson)) {
    return mock(require(fileJson));
  }

  var fileHjson = fileName + '.hjson';
  if ((0, _utils.accessible)(fileHjson)) {
    return require(fileHjson);
  }

  return {};
}

// lru-caches options
var opts = {
  max: 800,
  maxAge: 1000 * 60 * 30
};

function datasourcesRecipe(app, drPath) {
  app.context['$caches'] = (0, _lruCache2.default)(opts);

  if (!(0, _utils.dirExists)(drPath)) {
    throw new Error('Wrong path: ' + drPath);
  }

  var ds = {};
  var dsFunc = function dsFunc(dsFile) {
    var func = require(dsFile).default;
    if (!app.context.$config.mock) {
      return func;
    }

    var mockData = fnGetMockData(dsFile);
    return function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, params) {
        var otherOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var _Object$assign, mock, cache, cacheAge, cacheKey, key, value;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _Object$assign = Object.assign({
                  mock: false,
                  cache: false,
                  cacheAge: 5000,
                  cacheKey: null
                }, otherOpts), mock = _Object$assign.mock, cache = _Object$assign.cache, cacheAge = _Object$assign.cacheAge, cacheKey = _Object$assign.cacheKey;

                if (!mock) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', mockData);

              case 3:
                if (cache) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return func(ctx, params);

              case 6:
                return _context.abrupt('return', _context.sent);

              case 7:
                key = cacheKey === null ? dsFile + '-' + (0, _objectHash2.default)(params) : cacheKey();

                if (ctx.$caches.has(key)) {
                  _context.next = 13;
                  break;
                }

                _context.next = 11;
                return func(ctx, params);

              case 11:
                value = _context.sent;

                ctx.$caches.set(key, value, cacheAge);

              case 13:
                return _context.abrupt('return', ctx.$caches.get(key));

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
  };
  (0, _glob2.default)(join('**/*.js'), { cwd: drPath, dot: false, sync: true }).map(function (file) {
    var name = (0, _camelcase2.default)(file.replace(/\//g, ' ').replace(/\.\w+$/, ''));
    ds[name] = dsFunc(join(drPath, file));
  });

  app.context['$ds'] = ds;
}