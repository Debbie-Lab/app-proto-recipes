import path from 'path'
import glob from 'glob'

import { dirExists } from '@root/utils'

const join = path.join

export default function contextRecipe(app, crPath) {

  if (!dirExists(crPath)) {
    throw new Error(`Wrong path: ${crPath}`)
  }

  glob(join('*.js'), { cwd: crPath, dot: false, sync: true })
    .map(file => {
      const Ctx = require(join(crPath, file)).default
      const ctxName = file.replace(/\.\w+$/, '')
      const ctxObj = new Ctx()

      if (app.context[ctxName]) {
        throw new Error(`Duplicate objects: ${ctxName}; see file '${file}'`)
      }

      app.context[ctxName] = ctxObj
    })
}

