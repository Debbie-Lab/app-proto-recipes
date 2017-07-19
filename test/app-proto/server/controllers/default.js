export default {
  urls: ['/', '/default'],
  template: 'default',
  controller: async function (ctx) {
    const unsplashUsers = ctx.$ds.unsplashUsers
    const users = await(unsplashUsers(ctx, {}, { mock: false, cache: true, cacheAge: 60000 }))
    const usersWithMock = await(unsplashUsers(ctx, {}, { mock: true }))
    return { foo: '來自服務端數據', users, usersWithMock }
  }
}
