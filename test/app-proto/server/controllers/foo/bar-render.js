export default {
  controller: async function (ctx) {
    const unsplashUsers = ctx.$ds.unsplashUsers
    const usersWithMock = await unsplashUsers(ctx, {}, true)

    const barFoo = await ctx.$ds.barFoo(ctx, {}, true)
    const fooBar = await ctx.$ds.fooBar(ctx, {}, true)

    ctx.render('schema', { usersWithMock, barFoo, fooBar })
  }
}
