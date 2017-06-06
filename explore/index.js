import Koa from 'koa'


const app = new Koa()
const log = console.log


app.use(async (ctx, next) => {
  console.log(typeof ctx.body, ctx.body)
  ctx.body = 'hello world\n'
  log(ctx)
})

app.listen(3000)
