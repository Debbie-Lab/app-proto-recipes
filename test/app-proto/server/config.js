import path from 'path'

const join = path.join
const logger = console.log

logger(join(__dirname, 'context'))
logger(join(__dirname, 'middlewares'))
logger(join(__dirname, 'render'))

export default {
  path: {
    context: join(__dirname, 'context'),
    middlewares: join(__dirname, 'middlewares'),
    render: join(__dirname, 'render'),
  }
}
