import Koa = require('koa')

export default function (app: Koa, dir: string) {
  console.log(app, dir)
  // app.context['debug'] = 'debug'
}
