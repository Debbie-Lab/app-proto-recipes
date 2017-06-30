require("hjson/lib/require-config")

import path from 'path'
import glob from 'glob'
import Hjson from 'hjson'
import mockjs from 'mockjs'
import LRU from 'lru-cache'
import hash from 'object-hash'
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

// lru-caches options
const opts = {
  length: function(n, key) { return n * 2 + key.length },
  dispose: function(key, n) { n.close },
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
    return async function(ctx, params, mock = false, cache = false, age = 5000) {
      if (mock) {
        return mockData
      }
      if (!cache) {
        return await func(ctx, params)
      }
      const key = hash(`${dsFile}-${params}`)
      if (!ctx.$caches.has(key)) {
        const value = await func(ctx, params)
        ctx.$caches.set(key, value, age)
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
