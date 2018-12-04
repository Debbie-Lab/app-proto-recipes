const logger = console.log

exports.default = async function(ctx, next) {
  ctx.njkrender = async (name, context={}) => {
    try {
      const res = await ctx.nunjucks.render(name, context)
      ctx.body = res
      ctx.status = 200
    } catch (e) {
      logger(e)
    }
  }
  ctx.render = ctx.njkrender
  await next()
}

