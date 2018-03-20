const glob = require('glob')
const { join } = require('path')
const compose = require('koa-compose')
const koaRouter = require('koa-router')
const { accessible, dirObjs } = require('./utils')

const router = koaRouter()
const routes = []

function routerRegister(url, method, middlewares, controller) {
  async function routerController(ctx, next) {
    const data = await controller.call(this, ctx, next)

    if (typeof data === 'undefined') return

    if (typeof serveData !== 'object' || Buffer.isBuffer(serveData)) {
      ctx.body = data
      return
    }
    ctx.$data = Object.assign(ctx.$data || {}, data || {})
    ctx.set('Content-Type', 'application/json; charset=utf-8')
    ctx.body = ctx.$data
  }

  const routerMiddlewares = async (ctx, next) => await compose(
    middlewares.filter(m => {
      if (m in ctx.$middlewares) return true
      else console.warn(`${m}: Unknown middleware`)
    }).map(m => ctx.$middlewares[m])
  ).call(this, ctx, next)

  routes.push({method: method.toLowerCase(), url: url})
  router[method.toLowerCase()](url,compose([routerMiddlewares].concat(routerController)))
}

function initSchema(controllerConfigs, defaultUrl) {
  if (!Array.isArray(controllerConfigs)) {
    (controllerConfigs.urls || [defaultUrl]).forEach(
      url => (controllerConfigs.methods || ['GET']).forEach(
        method => routerRegister(url, method, controllerConfigs.middlewares || [], controllerConfigs.controller)))
    return
  }

  controllerConfigs.forEach(controllerConfig => {
    if(!controllerConfig.urls || !controllerConfig.urls.length || controllerConfig.urls.length === 0)
      throw new Error('Url not configured ...')

    const schema = Object.assign({ methods: ['GET'], middlewares: [] }, controllerConfig)

    const urls = schema.urls
    const methods = schema.methods

    urls.forEach(
      url => methods.forEach(
        method => routerRegister(url, method, schema.middlewares, schema.controller)))
  })
}

module.exports = async function (app, cwd) {

  if (!accessible(cwd)) throw new Error('Directory path error ...')

  glob.sync(join('**/*.js'), { cwd })
    .forEach(file => {
      const controllerConfigs = require(join(cwd, file))
      // template inference
      const defaultUrl = `/${file.substr(0, /\.js$/.exec(file).index)}`
      initSchema(controllerConfigs, defaultUrl)
    })

  app.context['$routes'] = routes
  app.use(router.routes())
    .use(router.allowedMethods())
}

