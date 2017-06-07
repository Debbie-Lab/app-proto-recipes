import context from '@recipes/context'
import middlewares from '@recipes/middlewares'
import controller from '@recipes/controller'
import datasources from '@recipes/datasources'

export default function recipes(app, config) {
  app.context['$config'] = config

  const path = config.path

  context(app, path.context)
  middlewares(app, path.middlewares)
  datasources(app, path.datasources, config.mock)
  controller(app, path.controllers, path.templates, path.bundles)
}


