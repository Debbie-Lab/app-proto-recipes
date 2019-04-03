const App = require('../').default

console.log('app', App)

const appConfig = {
  server: __dirname,
}

const app = new App(appConfig)

app.use(async (ctx, next) => {
  ctx.debug.log('ctx-register debug')
  ctx.body = 'hello app-proto'
  await next()
})

app.listen(3001)