const glob = require('glob')
const { join } = require('path')
const camelCase = require('camelcase')
const { accessible } = require('./utils')

const root = process.cwd()

module.exports = async function (app, cwd) {
  if (!cwd || !accessible(cwd)) throw new Error('"ctx-registers" 路径配置错误')

  const pkgsFile = join(cwd, '$pkges.js') // ctx-registers/$pkges.js

  do {
    if (!accessible(pkgsFile)) break

    const pkges = require(pkgsFile)
    Object.keys(pkges).forEach(name => {
      const Ctx = require(join(root, 'node_modules', pkges[name]))
      console.log('Ctx', Ctx)
      if (app.context[name]) throw new Error('ctx is re-registered ...')
      app.context[name] = new Ctx()
    })

  } while(false)

  glob.sync('**/*.js', { cwd, dot: false })
    .filter(file => !file.startsWith('$'))
    .map(file => {
      const Ctx = require(join(cwd, file))
      console.log('Ctx', Ctx)
      const name = camelCase(file.replace(/\//g, ' ').replace(/\.\w+$/, ''))
      const ctxObj = new Ctx()

      if (app.context[name]) throw new Error('ctx is re-registered ...')
      app.context[name] = ctxObj
    })
}

