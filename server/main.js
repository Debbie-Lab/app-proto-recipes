const App = require('../').default

console.log('app', App)

const appConfig = {
  server: __dirname,
}

const app = new App(appConfig)
console.log(app)