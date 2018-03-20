require("hjson/lib/require-config")

import path from 'path'
import glob from 'glob'
import Hjson from 'hjson'
import mockjs from 'mockjs'
import LRU from 'lru-cache'
import hash from 'object-hash'
import camelCase from 'camelcase'

import { dirExists, accessible } from '../utils'


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

  return {}
}

// lru-caches options
const opts = {
  max: 800,
  maxAge: 1000 * 60 * 30,
}

export default function datasourcesRecipe(app, drPath) {
  app.context['$caches'] = LRU(opts)

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
    return async function(ctx, params, otherOpts = {}) {
      const { mock, cache, cacheAge, cacheKey } = Object.assign(
        {
          mock: false,
          cache: false,
          cacheAge: 5000,
          cacheKey: null,
        }, otherOpts)
      if (mock) {
        return mockData
      }
      if (!cache) {
        return await func(ctx, params)
      }
      const key = (cacheKey === null) ? `${dsFile}-${hash(params)}` : cacheKey()
      if (!ctx.$caches.has(key)) {
        const value = await func(ctx, params)
        ctx.$caches.set(key, value, cacheAge)
      }
      return ctx.$caches.get(key)
    }
  }
  glob(join('**/*.js'), {cwd: drPath, dot: false, sync: true})
    .map(file => {
      const name = camelCase(file.replace(/\//g, ' ').replace(/\.\w+$/, ''))
      ds[name] = dsFunc(join(drPath, file))
    })

  app.context['$ds'] = ds
}
