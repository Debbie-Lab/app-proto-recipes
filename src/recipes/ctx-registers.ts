
import { sync } from 'glob'
import * as path from 'path'

import App from '../index'
import accessible from '../utils/accessible'

export default async function (app: App) {

  const ctxRegisterPath = path.resolve(app.$config.server, 'ctx-registers')

  if (!accessible(ctxRegisterPath)) {
    console.warn(`warning → "${ctxRegisterPath}" not found.`)
    return
  }

  const pkgPath = path.resolve(ctxRegisterPath, '$pkges.js')

  if (accessible(pkgPath)) {
    const pkges = await import(pkgPath)
    await (async () => Object.keys(pkges)
      .forEach(async (key: string) => app.context[key] = new (await import(pkges[key])).default(app))
    )()
  }

  await (async () =>
    sync('**/*.js', { cwd: ctxRegisterPath, dot: false })
      .filter(f => !f.startsWith('$'))
      .forEach(async f => app.context[f.replace(/\.\w+$/, '')] = new (await import(path.resolve(ctxRegisterPath, f))).default(app))
  )()

  console.log('app.context.debug', app.context.debug)
}
