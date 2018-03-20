const glob = require('glob')
const { join } = require('path')
const { accessible } = require('./utils')

const root = process.cwd()

module.exports = async function (app, cwd) {
  console.log('middlewares', cwd)
  console.log('middlewares', root)
  if (!cwd || !accessible(cwd)) throw new Error('"middlewares" 路径配置错误')

  const pkgsFile = join(cwd, '$pkges.js') // ctx-registers/$pkges.js


  const middlewares = {}

  do {
    if (!accessible(pkgsFile)) break

    const pkges = require(pkgsFile)
    Object.keys(pkges).forEach(key => {
      if (middlewares[key]) throw new Error('middleware is re-registered ...')
      middlewares[key] = require(join(root, 'node_modules',  pkges[key]))
    })

  } while(false)

  glob.sync('**/*.js', { cwd, dot: false })
    .filter(file => !file.startsWith('$'))
    .map(file => {
      const key = file.replace(/\.\w+$/, '')
      if (middlewares[key]) throw new Error('middleware is re-registered ...')
      middlewares[key] = require(join(cwd, file))
    })


  app.context['$middlewares'] = middlewares

  const global = join(cwd, '$global.js')
  if (!accessible(global)) return

  const globMiddlewares = require(global)

  globMiddlewares.forEach(m => {
    if (m in middlewares) app.use(middlewares[m])
    else console.warn(`middlewares '${m}' NOT FOUND!`)
  })

}
