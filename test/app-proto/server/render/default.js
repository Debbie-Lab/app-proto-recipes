export default {
  urls: ['/', '/default'],
  template: 'default',
  controller: async function (ctx) {
    return { foo: '來自服務端數據' }
  }
}
