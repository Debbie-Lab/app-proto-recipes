import Koa from 'koa'


const app = new Koa()
const log = console.log


app.use(async (ctx, next) => {
  ctx.body = 'hello world\n'
  log(ctx)
})

app.listen(3000)
