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
var routes = [];

function routerRegister(url, method, middlewares, controller, template, page) {
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

              if (!(template === null)) {
                _context.next = 8;
                break;
              }

              ctx.body = ctx.$data;
              _context.next = 13;
              break;

            case 8:
              Template = ctx.$tpls[template];
              tpl = new Template({
                serveData: ctx.$data,
                middlewares: ctx.$middlewares,
                routes: ctx.$routes,
                tpls: ctx.$tpls,
                page: ctx.$pages[page],
                key: page
              });
              _context.next = 12;
              return tpl.toHtml();

            case 12:
              ctx.body = _context.sent;

            case 13:
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
                }
              });
              _context2.next = 4;
              return (0, _koaCompose2.default)(availableMiddlewares).call(_this, ctx, next);

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

  routes.push({ method: method.toLowerCase(), url: url });
  router[method.toLowerCase()](url, (0, _koaCompose2.default)([renderMiddlewares].concat(routerController)));
}

function initSchema(renderConfigs, page, rrPath, tplPath) {
  var defaultUrl = '/' + page;
  if (!Array.isArray(renderConfigs)) {
    (renderConfigs.urls || [defaultUrl]).forEach(function (url) {
      return (renderConfigs.methods || ['GET']).forEach(function (method) {
        return routerRegister(url, method, renderConfigs.middlewares || [], renderConfigs.controller, renderConfigs.template || null, page);
      } // end method
      );
    } // end renderConfigs.methods
    ); // end renderConfigs.urls
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
      template: null
    }, renderConfig);

    var urls = schema.urls;
    var methods = schema.methods;

    urls.forEach(function (url) {
      return methods.forEach(function (method) {
        return routerRegister(url, method, schema.middlewares, schema.controller, schema.template, page);
      } // end method
      );
    } // end url
    ); // end urls
  });
}

// renderRecipePath templatesPath, clientPatesPath
function renderRecipe(app, rrPath, tplPath, cpPath) {

  app.context['$tpls'] = (0, _utils.getDirObjs)(tplPath);
  app.context['$pages'] = (0, _utils.getDirObjs)(cpPath);

  if (!(0, _utils.dirExists)(rrPath)) {
    throw new Error('Wrong path: ' + rrPath);
  }

  (0, _glob2.default)(join('**/*.js'), { cwd: rrPath, dot: false, sync: true }).forEach(function (file) {
    var renderConfigs = require(join(rrPath, file)).default;
    var page = file.replace('.js', '');
    initSchema(renderConfigs, page, rrPath, tplPath);
  });

  app.context['$routes'] = routes;
  app.use(router.routes()).use(router.allowedMethods());
}