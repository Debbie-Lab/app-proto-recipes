const { accessible, dirObjs } = require('./lib/utils')
const initCtxRegisters = require('./lib/ctx-registers')
const initMiddlewares = require('./lib/middlewares')
const initControllers = require('./lib/controllers')

module.exports = async function recipes(app, config = {}) {
  app.context['$config'] = config

  console.log('config', config)

  const templates = config.path.templates
  app.context['$tpls'] = accessible(templates) ? dirObjs(templates) : {}

  const bundlesConfig = config.bundlesConfig || {}
  app.context['$bundles'] = accessible(bundlesConfig.path) ? dirObjs(bundlesConfig.path, bundlesConfig.whitelist || []) : {}

  await initCtxRegisters(app, config.path['ctx-registers'])
  await initMiddlewares(app, config.path['middlewares'])      // $middlewares
  await initControllers(app, config.path['controllers']) // $routes
}

