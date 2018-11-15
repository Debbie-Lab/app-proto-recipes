import ctxRegisters from '@recipes/ctx-registers'
import middlewares from '@recipes/middlewares'
import controllers from '@recipes/controllers'
import datasources from '@recipes/datasources'

export default function recipes(app, config) {
  app.context['$config'] = config

  const path = config.path

  ctxRegisters(app, path['ctx-registers'])
  middlewares(app, path.middlewares)
  datasources(app, path.datasources, config.mock)
  controllers(app, path.controllers, path.templates, path.bundles)
}

