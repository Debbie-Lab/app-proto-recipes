'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = recipes;

var _context = require('./recipes/context');

var _context2 = _interopRequireDefault(_context);

var _middlewares = require('./recipes/middlewares');

var _middlewares2 = _interopRequireDefault(_middlewares);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function recipes(app, config) {
  app.context['$config'] = config;

  var path = config.path;

  (0, _context2.default)(app, path.context);
  (0, _middlewares2.default)(app, path.middlewares);
}