import * as Koa from 'koa'
import App from '../../'
import { MiddlewareContext } from '../../'
const app: App = new App({})

console.log(app)
console.log('hello ts-node')

app.use(ctx => {
  ctx.body = 'Hello Koa'
  console.log(ctx)
  console.log(ctx.$config)
})

app.listen(3000)
