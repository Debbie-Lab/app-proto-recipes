'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderRecipe;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var join = _path2.default.join;
var router = (0, _koaRouter2.default)();

/**
 * @param {string} tplPath
 **/
function routerRegister(url, method, middlewares, controller, template, tplPath) {
  var _this = this;

  var routerController = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
      var serveData, Template, tpl;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return controller.call(this, ctx, next);

            case 2:
              serveData = _context.sent;

              ctx.$data = Object.assign(ctx.$data || {}, serveData || {});

              if (typeof template === 'undefined') {
                ctx.body = ctx.$data;
              } else {
                Template = require(tplPath + '/' + template).defalut;
                tpl = new Template({ serveData: ctx.$data });

                ctx.body = tpl.toHtml();
              }

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function routerController(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var renderMiddlewares = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
      var availableMiddlewares;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              availableMiddlewares = [];

              middlewares.forEach(function (middlewareName) {
                if (middlewareName in ctx.$middlewares) {
                  availableMiddlewares.push(ctx.$middlewares[middlewareName]);
                } else {
                  availableMiddlewares.push(require(middlewareName)(_this));
                }
              });
              _context2.next = 4;
              return (0, _koaCompose2.default)(availableMiddlewares).call(_this.ctx, next);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function renderMiddlewares(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  router[method.toLowerCase()](url, (0, _koaCompose2.default)([renderMiddlewares].concat(routerController)));
}

function initSchema(renderConfigs, defaultUrl, rrPath, tplPath) {
  if (!Array.isArray(renderConfigs)) {
    routerRegister(defaultUrl, renderConfigs.methods || ['GET'], renderConfigs.middlewares || [], renderConfigs.controller, renderConfigs.template || 'default', tplPath);
    return;
  }

  renderConfigs.forEach(function (renderConfig) {
    if (typeof renderConfig.urls === 'undefined' || typeof renderConfig.urls.length === 'undefined' || renderConfig.urls.length === 0) {
      throw new Error('Wrong router config: empty url \'' + rrPath + '\'');
    }
    var schema = Object.assign({
      urls: [defaultUrl],
      methods: ['GET'],
      middlewares: [],
      template: 'dafault'
    }, renderConfig);

    var urls = schema.urls;
    var methods = schema.methods;

    urls.forEach(function (url) {
      return methods.forEach(function (method) {
        return routerRegister(url, method, schema.middlewares, schema.controller, schema.controller, tplPath);
      } // end method
      );
    } // end url
    ); // end urls
  });
}

function renderRecipe(app, rrPath, tplPath) {

  if (!(0, _utils.dirExists)(rrPath)) {
    throw new Error('Wrong path: ' + rrPath);
  }
  if (!(0, _utils.dirExists)(tplPath)) {
    throw new Error('Wrong path: ' + tplPath);
  }

  var files = (0, _glob2.default)(join('**/*.js'), { cwd: rrPath, dot: false, sync: true });

  files.forEach(function (file) {
    var renderConfigs = require(join(rrPath, file)).default;
    var defaultUrl = '/' + file.replace('.js', '');

    initSchema(renderConfigs, defaultUrl, rrPath, tplPath);
  });

  app.use(router.routes()).use(router.allowedMethods());
}