export default {
  controller: async function (ctx) {
    const unsplashUsers = ctx.$ds.unsplashUsers
    const usersWithMock = await unsplashUsers(ctx, {}, { mock: true })

    const barFoo = await ctx.$ds.barFoo(ctx, {}, { mock: true })
    const fooBar = await ctx.$ds.fooBar(ctx, {}, { mock: true })

    await ctx.render('schema', { usersWithMock, barFoo, fooBar })
  },
}
