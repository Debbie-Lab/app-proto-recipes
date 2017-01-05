const logger = console.log

export default async function(ctx, next) {
  logger('sayHey', 'hello world')
  await next()
}
