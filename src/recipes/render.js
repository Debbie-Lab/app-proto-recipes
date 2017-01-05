import path from 'path'
import glob from 'glob'
import compose from 'koa-compose'
import koaRouter from 'koa-router'

import { dirExists } from '@root/utils'


const join = path.join
const router = koaRouter()

/**
 * @param {string} tplPath
 **/
function routerRegister(url, method, middlewares, controller, template, tplPath) {
  async function routerController(ctx, next) {
    const serveData = await controller.call(this, ctx, next)
    ctx.$data = Object.assign(ctx.$data || {}, serveData || {})

    if (typeof template === 'undefined') {
      ctx.body = ctx.$data
    } else {
      const Template = require(`${tplPath}/${template}`).defalut
      const tpl = new Template({serveData: ctx.$data})
      ctx.body = tpl.toHtml()
    }
  }

  const renderMiddlewares = async (ctx, next) => {
    const availableMiddlewares = []
    middlewares.forEach(middlewareName => {
      if (middlewareName in ctx.$middlewares) {
        availableMiddlewares.push(ctx.$middlewares[middlewareName])
      } else {
        availableMiddlewares.push(require(middlewareName)(this))
      }
    })
    await compose(availableMiddlewares).call(this. ctx, next)
  }

  router[method.toLowerCase()](
    url,
    compose([renderMiddlewares].concat(routerController))
  )
}

function initSchema(renderConfigs, defaultUrl, rrPath, tplPath) {
  if (!Array.isArray(renderConfigs)) {
    routerRegister(defaultUrl,
      renderConfigs.methods || ['GET'],
      renderConfigs.middlewares || [],
      renderConfigs.controller,
      renderConfigs.template || 'default',
      tplPath
    )
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
        template: 'dafault',
      }, renderConfig)

    const urls = schema.urls
    const methods = schema.methods

    urls.forEach(
      url => methods.forEach(
        method => routerRegister(url,
          method,
          schema.middlewares,
          schema.controller,
          schema.controller,
          tplPath
        ) // end method
      ) // end url
    ) // end urls
  })
}

export default function renderRecipe(app, rrPath, tplPath) {

  if (!dirExists(rrPath)) {
    throw new Error(`Wrong path: ${rrPath}`)
  }
  if (!dirExists(tplPath)) {
    throw new Error(`Wrong path: ${tplPath}`)
  }

  const files = glob(join('**/*.js'), { cwd: rrPath, dot: false, sync: true })

  files.forEach(file => {
    const renderConfigs = require(join(rrPath, file)).default
    const defaultUrl = `/${file.replace('.js', '')}`

    initSchema(renderConfigs, defaultUrl, rrPath, tplPath)
  })

  app.use(router.routes())
    .use(router.allowedMethods())
}
