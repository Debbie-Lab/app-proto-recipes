export default {
  urls: ['/', '/default'],
  template: 'default',
  controller: async function (ctx) {
    const unsplashUsers = ctx.$ds.unsplashUsers
    const users = await(unsplashUsers(ctx, {}))
    const usersWithMock = await(unsplashUsers(ctx, {}, true))
    return { foo: '來自服務端數據', users, usersWithMock }
  }
}
