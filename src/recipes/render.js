import path from 'path'
import glob from 'glob'
import compose from 'koa-compose'
import koaRouter from 'koa-router'

import { dirExists } from '../utils'

/**
 * @param {{urls: array,
            methods: array,
            controller: (async)function,
            template: string,
            middlewares: array}} schema
 * @param {string} templateDir
 **/
function routeRegister(url, method, schema, templateDir) {
}

function initSchema(schema, fileName, isArray) {
  if (isArray && schema.url.length === 0) {

        urls.forEach(url => methods.forEach(method => routerRegister(url, method, schema, templateDir))

      })
    })

}
