import Koa from 'koa'
import config from '@server/config'
import recipes from '@app-proto/recipes'


const logger = console.log
const env = process.env.NODE_ENV || 'dev'

logger(recipes)

function main() {
  const app = new Koa()
  recipes(app, config)
  app.listen(3000)
}

main()
