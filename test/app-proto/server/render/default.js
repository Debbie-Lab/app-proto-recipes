export default {
  urls: ['/', 'default'],
  controller: function async () {
    return { foo: '來自服務端數據' }
  }
}
