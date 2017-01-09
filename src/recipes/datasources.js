import path from 'path'
import glob from 'glob'
import mockjs from 'mockjs'
import camelCase from 'camelcase'

import { dirExists, accessible } from '@root/utils'


const join = path.join
const mock = mockjs.mock

export default function datasourcesRecipe(app, drPath) {
  if (!dirExists(drPath)) {
    throw new Error(`Wrong path: ${drPath}`)
  }

  const ds = {}
  const dsFunc = dsFile => {
    const func = require(dsFile).default
    if (!app.context.$config.mock) {
      return func
    }
    const mockFile = dsFile.replace('.js', '.json')
    const mockData = accessible(mockFile) ? mock(require(mockFile)) : {}

    return async function(ctx, params, mock = false) {
      if (mock) {
        return mockData
      }
      return await func(ctx, params)
    }
  }
  glob(join('**/*.js'), {cwd: drPath, dot: false, sync: true})
    .map(file => {
      const name = camelCase(file.replace('/', ' ').replace(/\.\w+$/, ''))
      ds[name] = dsFunc(join(drPath, file))
    })

  app.context['$ds'] = ds
}
