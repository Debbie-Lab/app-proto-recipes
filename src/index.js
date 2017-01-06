import context from '@recipes/context'

import middlewares from '@recipes/middlewares'
import render from '@recipes/render'


export default function recipes(app, config) {
  app.context['$config'] = config

  const path = config.path

  context(app, path.context)
  middlewares(app, path.middlewares)
  render(app, path.render, path.templates)
}


