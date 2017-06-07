import Koa from 'koa'


const app = new Koa()
const log = console.log


app.use(async (ctx, next) => {
  console.log(typeof ctx.body, ctx.body)
  ctx.body = 'hello world\n'
  log(ctx)
})


import path from 'path'
import glob from 'glob'

const join = path.join

glob(join('**/*.js'), { cwd: '../src', dot: false, sync: true })
   .forEach(file => console.log(file))


console.log(Buffer, Buffer.from([1, 2, 3]))
console.log(Buffer.isBuffer([Buffer.from([1, 2, 3])]))
// app.listen(3000)
