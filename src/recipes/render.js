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
    const serveData = await controller.call(this, ctx, next)
    ctx.$data = Object.assign(ctx.$data || {}, serveData || {})

    if (template === null) {
      ctx.body = ctx.$data
    } else {
      const Template = ctx.$tpls[template]
      const tpl = new Template({
        serveData: ctx.$data,
        middlewares: ctx.$middlewares,
        routes: ctx.$routes,
        tpls: ctx.$tpls,
        page: ctx.$pages[page],
        key: page,
      })
      ctx.body = tpl.toHtml()
    }
  }

  const renderMiddlewares = async (ctx, next) => {
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
    compose([renderMiddlewares].concat(routerController))
  )
}

function initSchema(renderConfigs, page, rrPath, tplPath) {
  const defaultUrl = `/${page}`
  if (!Array.isArray(renderConfigs)) {
    (renderConfigs.urls || [defaultUrl]).forEach(url =>
      (renderConfigs.methods || ['GET']).forEach(
        method => routerRegister(url,
          method,
          renderConfigs.middlewares || [],
          renderConfigs.controller,
          renderConfigs.template || null,
          page
        ) // end method
      ) // end renderConfigs.methods
    ) // end renderConfigs.urls
    return
  }

  renderConfigs.forEach(renderConfig => {
    if(typeof renderConfig.urls === 'undefined' ||
      typeof renderConfig.urls.length === 'undefined' ||
      renderConfig.urls.length === 0) {
      throw new Error(`Wrong router config: empty url '${rrPath}'`)
    }
    const schema = Object.assign({
        urls: [defaultUrl],
        methods: ['GET'],
        middlewares: [],
        template: null,
      }, renderConfig)

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

// renderRecipePath templatesPath, clientPatesPath
export default function renderRecipe(app, rrPath, tplPath, cpPath) {

  app.context['$tpls'] = getDirObjs(tplPath)
  app.context['$pages'] = getDirObjs(cpPath)

  if (!dirExists(rrPath)) {
    throw new Error(`Wrong path: ${rrPath}`)
  }

  glob(join('**/*.js'), { cwd: rrPath, dot: false, sync: true })
    .forEach(file => {
      const renderConfigs = require(join(rrPath, file)).default
      const page = file.replace('.js', '')
      initSchema(renderConfigs, page, rrPath, tplPath)
    })

  app.context['$routes'] = routes
  app.use(router.routes())
    .use(router.allowedMethods())
}

