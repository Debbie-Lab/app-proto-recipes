'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = recipes;

var _context = require('./recipes/context');

var _context2 = _interopRequireDefault(_context);

var _middlewares = require('./recipes/middlewares');

var _middlewares2 = _interopRequireDefault(_middlewares);

var _render = require('./recipes/render');

var _render2 = _interopRequireDefault(_render);

var _datasources = require('./recipes/datasources');

var _datasources2 = _interopRequireDefault(_datasources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function recipes(app, config) {
  app.context['$config'] = config;

  var path = config.path;

  (0, _context2.default)(app, path.context);
  (0, _middlewares2.default)(app, path.middlewares);
  (0, _datasources2.default)(app, path.datasources, config.mock);
  (0, _render2.default)(app, path.render, path.templates);
}