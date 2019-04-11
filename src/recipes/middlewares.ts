import { sync } from 'glob'
import * as path from 'path'

import App from '../index'
import accessible from '../utils/accessible'

export default async function (app: App) {

  const middlewaresPath = path.resolve(app.$config.server, 'middlewares')

  if (!accessible(middlewaresPath)) {
    console.warn(`warning → "${middlewaresPath}" not found.`)
    return
  }

  const middlewares = {}

  const pkgPath = path.resolve(middlewaresPath, '$pkges.js')

  if (accessible(pkgPath)) {
    const pkges = await import(pkgPath)

    await (async () => Object.keys(pkges)
      .forEach(async (key: string) => middlewares[key] = await import(pkges[key]))
    )()
  }

  await (async () =>
    sync('**/*.js', { cwd: middlewaresPath, dot: false })
      .filter(f => !f.startsWith('$'))
      .forEach(async f =>
        middlewares[f.replace(/\.\w+$/, '')] = await import(path.resolve(middlewaresPath, f))
      )
  )()

  app.context['$middlewares'] = middlewares
}
