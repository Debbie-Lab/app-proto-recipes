import Koa from 'koa'
import config from '@server/config'
import recipes from 'app-proto-recipes'


const logger = console.log

logger(recipes)

const env = process.env.NODE_ENV || 'dev'

const app = new Koa()

recipes(app, config)

app.use((ctx, next) => {
  logger(ctx.$config)
  logger(ctx.$middlewares)
  const http = ctx.http
  ctx.body = 'hello world'
})

app.listen(3000)
