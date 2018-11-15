import path from 'path'
import glob from 'glob'

import { dirExists, accessible, getDataType } from '@root/utils'

const join = path.join

export default function contextRecipe(app, crPath) {

  if (!dirExists(crPath)) {
    throw new Error(`Wrong path: ${crPath}`)
  }

  const pkgPath = join(crPath, '$pkges.js')
  if (accessible(pkgPath)) {
    const pkges = require(pkgPath).default
    if (getDataType(pkges) !== 'Object') {
      throw new Error(`"${pkgPath}" error: must a object.`)
    }

    Object.keys(pkges).forEach(key => {
      const Ctx = require(pkges[key]).default
      if (app.context[key]) {
        throw new Error(`Duplicate objects: ${pkg}; see file '${pkgPath}'`)
      }
      app.context[key] = new Ctx()
    })
  }


  glob(join('**/*.js'), { cwd: crPath, dot: false, sync: true })
    .filter(file => !file.startsWith('$'))
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

