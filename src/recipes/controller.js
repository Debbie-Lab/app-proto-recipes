import path from 'path'
import glob from 'glob'
import compose from 'koa-compose'
import koaRouter from 'koa-router'

import { dirExists, getDirObjs } from '@root/utils'


const join = path.join
const router = koaRouter()
const routes = []

function routerRegister(url, method, middlewares, controller, template, page) {
  async function routerController(ctx, next) {
    ctx.render = async (tpl, data, page) => {
      const Template = ctx.$tpls[tpl]
      const template = new Template({
        ctx, page,
        serveData: data,
        serveBundle: ctx.$bundles[page],
      })
      if (typeof ctx.body !== 'undefined') {
        console.warn(`'ctx.body' has been assigned: ${ctx.body}`)
      }

      ctx.body = await template.toHtml()
    }

    const serveData = await controller.call(this, ctx, next)

    if (typeof serveData === 'undefined') {
      return
    }

    if (typeof serveData !== 'object' || Buffer.isBuffer(serveData)) {
      ctx.body = serveData
      return
    }

    ctx.$data = Object.assign(ctx.$data || {}, serveData || {})

    if (template === null) {
      ctx.body = ctx.$data
      return
    }

    ctx.render(template, ctx.$data, page)
  }

  const controllerMiddlewares = async (ctx, next) => {
    const availableMiddlewares = []
    middlewares.forEach(middlewareName => {
      if (middlewareName in ctx.$middlewares) {
        availableMiddlewares.push(ctx.$middlewares[middlewareName])
      }
    })
    await compose(availableMiddlewares).call(this, ctx, next)
  }

  routes.push({method: method.toLowerCase(), url: url})
  router[method.toLowerCase()](
    url,
    compose([controllerMiddlewares].concat(routerController))
  )
}

function initSchema(controllerConfigs, page, controllerPath, tplPath) {
  const defaultUrl = `/${page}`

  if (!Array.isArray(controllerConfigs)) {
    (controllerConfigs.urls || [defaultUrl]).forEach(
      url => (controllerConfigs.methods || ['GET']).forEach(
        method => routerRegister(url,
          method,
          controllerConfigs.middlewares || [],
          controllerConfigs.controller,
          controllerConfigs.template || null,
          page
        ) // end method
      ) // end renderConfigs.methods
    ) // end renderConfigs.urls
    return
  }

  controllerConfigs.forEach(controllerConfig => {
    if(typeof controllerConfig.urls === 'undefined' ||
      typeof controllerConfig.urls.length === 'undefined' ||
      controllerConfig.urls.length === 0) {
      throw new Error(`Wrong router config: empty url '${controllerPath}'`)
    }
    const schema = Object.assign({
        urls: [defaultUrl],
        methods: ['GET'],
        middlewares: [],
        template: null,
      }, controllerConfig)

    const urls = schema.urls
    const methods = schema.methods

    urls.forEach(
      url => methods.forEach(
        method => routerRegister(url,
          method,
          schema.middlewares,
          schema.controller,
          schema.template,
          page
        ) // end method
      ) // end url
    ) // end urls
  })
}

// controllerPath, tplPath, bundlesConfig
export default function controllerRecipe(app, controllerPath, tplPath, bundlesConfig) {

  app.context['$tpls'] = getDirObjs(tplPath)
  app.context['$bundles'] = getDirObjs(bundlesConfig.path, bundlesConfig.whitelist || [])
  console.log(app.context['$bundles'])

  if (!dirExists(controllerPath)) {
    throw new Error(`Wrong path: ${controllerPath}`)
  }

  glob(join('**/*.js'), { cwd: controllerPath, dot: false, sync: true })
     .forEach(file => {
       const controllerConfigs = require(join(controllerPath, file)).default

      // template inference
      const page = file.substr(0, /\.js$/.exec(file).index)

      initSchema(controllerConfigs, page, controllerPath, tplPath)
    })

  app.context['$routes'] = routes
  app.use(router.routes())
    .use(router.allowedMethods())
}

