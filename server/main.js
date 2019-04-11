const App = require('../').default

const appConfig = {
  server: __dirname,
}

const app = new App(appConfig)

app.use(async (ctx, next) => {
  ctx.debug.log('ctx-register debug', ctx.url)
  ctx.body = 'hello app-proto'
  await next()
})

app.listen(3001)