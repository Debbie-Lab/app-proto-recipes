const logger = console.log

export default async function(ctx, next) {
  logger('sayHey', 'hello world')
  console.log('ctx.$routes', ctx.$routes)
  await next()
}
