"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = controllerRecipe;

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const join = _path.default.join;
const router = (0, _koaRouter.default)();
const routes = [];

function routerRegister(url, method, middlewares, controller, template, page) {
  async function routerController(ctx, next) {
    const render = async (tpl, data, page) => {
      const Template = ctx.$tpls[tpl];
      const template = new Template({
        ctx,
        page,
        serveData: data,
        serveBundle: ctx.$bundles[page]
      });

      if (typeof ctx.body !== 'undefined') {
        console.warn(`'ctx.body' has been assigned: ${ctx.body}`);
      }

      ctx.body = await template.toHtml();
    };

    ctx.render = ctx.render || render;
    const serveData = await controller.call(this, ctx, next);

    if (typeof serveData === 'undefined') {
      return;
    }

    if (typeof serveData !== 'object' || Buffer.isBuffer(serveData)) {
      ctx.body = serveData;
      return;
    }

    ctx.$data = Object.assign(ctx.$data || {}, serveData || {});

    if (template === null) {
      ctx.body = ctx.$data;
      return;
    }

    ctx.render(template, ctx.$data, page);
  }

  const controllerMiddlewares = async (ctx, next) => {
    const availableMiddlewares = [];
    middlewares.forEach(middlewareName => {
      if (middlewareName in ctx.$middlewares) {
        availableMiddlewares.push(ctx.$middlewares[middlewareName]);
      }
    });
    await (0, _koaCompose.default)(availableMiddlewares).call(this, ctx, next);
  };

  routes.push({
    method: method.toLowerCase(),
    url: url
  });
  router[method.toLowerCase()](url, (0, _koaCompose.default)([controllerMiddlewares].concat(routerController)));
}

function initSchema(controllerConfigs, page, controllerPath, tplPath) {
  const defaultUrl = `/${page}`;

  if (!Array.isArray(controllerConfigs)) {
    (controllerConfigs.urls || [defaultUrl]).forEach(url => (controllerConfigs.methods || ['GET']).forEach(method => routerRegister(url, method, controllerConfigs.middlewares || [], controllerConfigs.controller, controllerConfigs.template || null, page) // end method
    ) // end renderConfigs.methods
    ); // end renderConfigs.urls

    return;
  }

  controllerConfigs.forEach(controllerConfig => {
    if (typeof controllerConfig.urls === 'undefined' || typeof controllerConfig.urls.length === 'undefined' || controllerConfig.urls.length === 0) {
      throw new Error(`Wrong router config: empty url '${controllerPath}'`);
    }

    const schema = Object.assign({
      urls: [defaultUrl],
      methods: ['GET'],
      middlewares: [],
      template: null
    }, controllerConfig);
    const urls = schema.urls;
    const methods = schema.methods;
    urls.forEach(url => methods.forEach(method => routerRegister(url, method, schema.middlewares, schema.controller, schema.template, page) // end method
    ) // end url
    ); // end urls
  });
} // controllerPath, tplPath, bundlesConfig


function controllerRecipe(app, controllerPath, tplPath, bundlesConfig) {
  app.context['$tpls'] = (0, _utils.getDirObjs)(tplPath);
  app.context['$bundles'] = (0, _utils.getDirObjs)(bundlesConfig.path, bundlesConfig.whitelist || []);

  if (!(0, _utils.dirExists)(controllerPath)) {
    throw new Error(`Wrong path: ${controllerPath}`);
  }

  (0, _glob.default)(join('**/*.js'), {
    cwd: controllerPath,
    dot: false,
    sync: true
  }).forEach(file => {
    const controllerConfigs = require(join(controllerPath, file)).default; // template inference


    const page = file.substr(0, /\.js$/.exec(file).index);
    initSchema(controllerConfigs, page, controllerPath, tplPath);
  });
  app.context['$routes'] = routes;
  app.use(router.routes()).use(router.allowedMethods());
}