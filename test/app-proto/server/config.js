import path from 'path'

const join = path.join
const logger = console.log

logger(join(__dirname, 'ctx-registers'))
logger(join(__dirname, 'middlewares'))
logger(join(__dirname, 'controllers'))
logger(join(__dirname, 'templates'))
logger(join(__dirname, 'datasources'))
logger(join(__dirname, '..', 'client', 'pages'))

export default {
  path: {
    'ctx-registers': join(__dirname, 'ctx-registers'),
    middlewares: join(__dirname, 'middlewares'),
    controllers: join(__dirname, 'controllers'),
    templates: join(__dirname, 'templates'),
    datasources: join(__dirname, 'datasources'),
    bundles: {
      path: join(__dirname, '..', 'client', 'pages'),
      whitelist: ['wl.js'],
    },
  },
  mock: true,
}

