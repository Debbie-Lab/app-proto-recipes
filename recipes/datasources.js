'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = datasourcesRecipe;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _mockjs = require('mockjs');

var _mockjs2 = _interopRequireDefault(_mockjs);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

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

  console.warn('Empty mock data: ' + file);
  return {};
}

function datasourcesRecipe(app, drPath) {
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
        var mock = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!mock) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', mockData);

              case 2:
                _context.next = 4;
                return func(ctx, params);

              case 4:
                return _context.abrupt('return', _context.sent);

              case 5:
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