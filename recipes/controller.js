'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = controllerRecipe;

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var join = _path2.default.join;
var router = (0, _koaRouter2.default)();
var routes = [];

function routerRegister(url, method, middlewares, controller, template, page) {
  var _this2 = this;

  var routerController = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
      var _this = this;

      var serveData;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              ctx.render = function () {
                var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(tpl, data, page) {
                  var Template, template;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          Template = ctx.$tpls[tpl];
                          template = new Template({
                            ctx: ctx, page: page,
                            serveData: data,
                            serveBundle: ctx.$bundles[page]
                          });

                          if (typeof ctx.body !== 'undefined') {
                            console.warn('\'ctx.body\' has been assigned: ' + ctx.body);
                          }

                          _context.next = 5;
                          return template.toHtml();

                        case 5:
                          ctx.body = _context.sent;

                        case 6:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3, _x4, _x5) {
                  return _ref2.apply(this, arguments);
                };
              }();

              _context2.next = 3;
              return controller.call(this, ctx, next);

            case 3:
              serveData = _context2.sent;

              if (!(typeof serveData === 'undefined')) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt('return');

            case 6:
              if (!((typeof serveData === 'undefined' ? 'undefined' : _typeof(serveData)) !== 'object' || Buffer.isBuffer(serveData))) {
                _context2.next = 9;
                break;
              }

              ctx.body = serveData;
              return _context2.abrupt('return');

            case 9:

              ctx.$data = Object.assign(ctx.$data || {}, serveData || {});

              if (!(template === null)) {
                _context2.next = 13;
                break;
              }

              ctx.body = ctx.$data;
              return _context2.abrupt('return');

            case 13:

              ctx.render(template, ctx.$data, page);

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function routerController(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var controllerMiddlewares = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
      var availableMiddlewares;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              availableMiddlewares = [];

              middlewares.forEach(function (middlewareName) {
                if (middlewareName in ctx.$middlewares) {
                  availableMiddlewares.push(ctx.$middlewares[middlewareName]);
                }
              });
              _context3.next = 4;
              return (0, _koaCompose2.default)(availableMiddlewares).call(_this2, ctx, next);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this2);
    }));

    return function controllerMiddlewares(_x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }();

  routes.push({ method: method.toLowerCase(), url: url });
  router[method.toLowerCase()](url, (0, _koaCompose2.default)([controllerMiddlewares].concat(routerController)));
}

function initSchema(controllerConfigs, page, controllerPath, tplPath) {
  var defaultUrl = '/' + page;

  if (!Array.isArray(controllerConfigs)) {
    (controllerConfigs.urls || [defaultUrl]).forEach(function (url) {
      return (controllerConfigs.methods || ['GET']).forEach(function (method) {
        return routerRegister(url, method, controllerConfigs.middlewares || [], controllerConfigs.controller, controllerConfigs.template || null, page // end method
        );
      } // end renderConfigs.methods
      );
    } // end renderConfigs.urls
    );return;
  }

  controllerConfigs.forEach(function (controllerConfig) {
    if (typeof controllerConfig.urls === 'undefined' || typeof controllerConfig.urls.length === 'undefined' || controllerConfig.urls.length === 0) {
      throw new Error('Wrong router config: empty url \'' + controllerPath + '\'');
    }
    var schema = Object.assign({
      urls: [defaultUrl],
      methods: ['GET'],
      middlewares: [],
      template: null
    }, controllerConfig);

    var urls = schema.urls;
    var methods = schema.methods;

    urls.forEach(function (url) {
      return methods.forEach(function (method) {
        return routerRegister(url, method, schema.middlewares, schema.controller, schema.template, page // end method
        );
      } // end url
      );
    } // end urls
    );
  });
}

// controllerPath, tplPath, bundlesConfig
function controllerRecipe(app, controllerPath, tplPath, bundlesConfig) {

  app.context['$tpls'] = (0, _utils.getDirObjs)(tplPath);
  app.context['$bundles'] = (0, _utils.getDirObjs)(bundlesConfig.path, bundlesConfig.whitelist || []);
  console.log(app.context['$bundles']);

  if (!(0, _utils.dirExists)(controllerPath)) {
    throw new Error('Wrong path: ' + controllerPath);
  }

  (0, _glob2.default)(join('**/*.js'), { cwd: controllerPath, dot: false, sync: true }).forEach(function (file) {
    var controllerConfigs = require(join(controllerPath, file)).default;

    // template inference
    var page = file.substr(0, /\.js$/.exec(file).index);

    initSchema(controllerConfigs, page, controllerPath, tplPath);
  });

  app.context['$routes'] = routes;
  app.use(router.routes()).use(router.allowedMethods());
}