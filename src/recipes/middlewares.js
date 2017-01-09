import path from 'path'
import glob from 'glob'
import compose from 'koa-compose'

import { dirExists } from '@root/utils'


const join = path.join

export default function middlewaresRecipe(app, mrPath) {

  if (!dirExists(mrPath)) {
    throw new Error(`Wrong path: ${mrPath}`)
  }

  const middlewares = []
  glob(join('*.js'), { cwd: mrPath, dot: false, sync: true })
    .filter(file => !file.startsWith('$'))
    .map(file => middlewares[file.replace('.js', '')] = require(join(mrPath, file)).default)

  app.context['$middlewares'] = middlewares

  console.log(join(mrPath, '$global.js'))
  const globMiddlewares = require(join(mrPath, '$global.js')).default

  console.log(globMiddlewares)
  if (!Array.isArray(globMiddlewares)) {
    throw new Error('$global.js error')
  }

  const availableMiddlewares = []
  globMiddlewares.forEach(middleware => {
    if (middleware in middlewares) {
      availableMiddlewares.push(middlewares[middleware])
    } else {
      throw new Error(`middlewares '${middleware}' NOT FOUND!`)
    }
  })
  app.use(compose(availableMiddlewares))
}
