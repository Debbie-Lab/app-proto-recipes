import path from 'path'
import glob from 'glob'
import compose from 'koa-compose'

import { dirExists, accessible} from '@root/utils'


const join = path.join

export default function middlewaresRecipe(app, mrPath) {

  if (!dirExists(mrPath)) {
    throw new Error(`Wrong path: ${mrPath}`)
  }

  const middlewares = {}

  const assign = (name, mw) => {
    if (typeof middlewares[name] !== 'undefined') {
      new Error(`Middleware is re-registered: ${name}`)
    } else {
      middlewares[name] = mw
    }
  }

  const pkgPath = join(mrPath, '$pkges.js')
  if (accessible(pkgPath)) {
    const pkges = require(pkgPath).default
    if (!Array.isArray(pkges)) {
      throw new Error(`"${pkgPath}" error: must array`)
    }
    pkges.forEach(pkg => assign(pkg, require(pkg).default))
  }

  glob(join('**/*.js'), { cwd: mrPath, dot: false, sync: true })
    .filter(file => !file.startsWith('$'))
    .map(file => assign(file.replace('.js', ''), require(join(mrPath, file)).default))

  app.context['$middlewares'] = middlewares

  const globMiddlewares = require(join(mrPath, '$global.js')).default

  if (!Array.isArray(globMiddlewares)) {
    throw new Error('"$global.js" error: must array')
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
