"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = recipes;

var _ctxRegisters = _interopRequireDefault(require("./recipes/ctx-registers"));

var _middlewares = _interopRequireDefault(require("./recipes/middlewares"));

var _controllers = _interopRequireDefault(require("./recipes/controllers"));

var _datasources = _interopRequireDefault(require("./recipes/datasources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function recipes(app, config) {
  app.context['$config'] = config;
  const path = config.path;
  (0, _ctxRegisters.default)(app, path['ctx-registers']);
  (0, _middlewares.default)(app, path.middlewares);
  (0, _datasources.default)(app, path.datasources, config.mock);
  (0, _controllers.default)(app, path.controllers, path.templates, path.bundles);
}