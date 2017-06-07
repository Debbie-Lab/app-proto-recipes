require("hjson/lib/require-config")

import path from 'path'
import glob from 'glob'
import mockjs from 'mockjs'
import Hjson from 'hjson'
import camelCase from 'camelcase'

import { dirExists, accessible } from '@root/utils'


const join = path.join
const mock = mockjs.mock
const parse = Hjson.parse

function fnGetMockData(file) {
  const fileName = file.substr(0, /\.js$/.exec(file).index)

  const fileJson = `${fileName}.json`
  if (accessible(fileJson)) {
    return mock(require(fileJson))
  }

  const fileHjson = `${fileName}.hjson`
  if (accessible(fileHjson)) {
    return require(fileHjson)
  }

  console.warn(`Empty mock data: ${file}`)
  return {}
}

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

    const mockData = fnGetMockData(dsFile)
    return async function(ctx, params, mock = false) {
      if (mock) {
        return mockData
      }
      return await func(ctx, params)
    }
  }
  glob(join('**/*.js'), {cwd: drPath, dot: false, sync: true})
    .map(file => {
      const name = camelCase(file.replace(/\//g, ' ').replace(/\.\w+$/, ''))
      ds[name] = dsFunc(join(drPath, file))
    })

  app.context['$ds'] = ds
}
